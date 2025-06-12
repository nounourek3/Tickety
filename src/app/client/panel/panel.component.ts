import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, VueloService } from '../../services/vuelo.service';
import { CommonModule } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import * as maplibregl from 'maplibre-gl';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { UserService } from '../../services/user.service';
import { EventInput } from '@fullcalendar/core';









@Component({
  selector: 'app-panel',
  imports: [FormsModule, CommonModule,FullCalendarModule ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {

  calendarOptions: CalendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin],
  events: [],
  locale: esLocale,
  eventClick: this.handleEventClick.bind(this)
};

countryNameMap: Record<string, string> = {
  FR: 'Francia',
  ES: 'España',
  IT: 'Italia',
  DE: 'Alemania',
  GB: 'Reino Unido',
  US: 'Estados Unidos',
  BR: 'Brasil',
  MX: 'México',
  AR: 'Argentina',
  CL: 'Chile',
  JP: 'Japón',
  KR: 'Corea del Sur',
  TR: 'Turquía',
  AE: 'Emiratos Árabes Unidos',
  MA: 'Marruecos',
  TN: 'Túnez',
  EG: 'Egipto',
  ZA: 'Sudáfrica',
  KE: 'Kenia',
  SN: 'Senegal',
  NG: 'Nigeria',
  SG: 'Singapur',
  TH: 'Tailandia'
};

map: maplibregl.Map | undefined;
airportOptions = [
  // 🇪🇸 Spain
  { code: 'MAD', name: 'Madrid - Barajas', countryCode: 'ES' },
  { code: 'BCN', name: 'Barcelona - El Prat', countryCode: 'ES' },
  { code: 'AGP', name: 'Málaga - Costa del Sol', countryCode: 'ES' },
  { code: 'VLC', name: 'Valencia - Manises', countryCode: 'ES' },

  // 🇫🇷 France
  { code: 'ORY', name: 'Paris - Orly', countryCode: 'FR' },
  { code: 'CDG', name: 'Paris - Charles de Gaulle', countryCode: 'FR' },
  { code: 'NCE', name: 'Nice - Côte d\'Azur', countryCode: 'FR' },
  { code: 'LYS', name: 'Lyon - Saint-Exupéry', countryCode: 'FR' },

  // 🇮🇹 Italy
  { code: 'FCO', name: 'Rome - Fiumicino', countryCode: 'IT' },
  { code: 'MXP', name: 'Milan - Malpensa', countryCode: 'IT' },
  { code: 'VCE', name: 'Venice - Marco Polo', countryCode: 'IT' },
  { code: 'NAP', name: 'Naples - Capodichino', countryCode: 'IT' },

  // 🇩🇪 Germany
  { code: 'FRA', name: 'Frankfurt', countryCode: 'DE' },
  { code: 'BER', name: 'Berlin - Brandenburg', countryCode: 'DE' },
  { code: 'MUC', name: 'Munich', countryCode: 'DE' },
  { code: 'HAM', name: 'Hamburg', countryCode: 'DE' },

  // 🇬🇧 United Kingdom
  { code: 'LHR', name: 'London - Heathrow', countryCode: 'GB' },
  { code: 'LGW', name: 'London - Gatwick', countryCode: 'GB' },
  { code: 'MAN', name: 'Manchester', countryCode: 'GB' },
  { code: 'EDI', name: 'Edinburgh', countryCode: 'GB' },

  // 🇺🇸 USA
  { code: 'JFK', name: 'New York - JFK', countryCode: 'US' },
  { code: 'EWR', name: 'Newark', countryCode: 'US' },
  { code: 'LAX', name: 'Los Angeles', countryCode: 'US' },
  { code: 'MIA', name: 'Miami', countryCode: 'US' },

  // 🇧🇷 Brazil
  { code: 'GRU', name: 'São Paulo - Guarulhos', countryCode: 'BR' },
  { code: 'GIG', name: 'Rio de Janeiro - Galeão', countryCode: 'BR' },

  // 🇲🇽 Mexico
  { code: 'MEX', name: 'Mexico City - Benito Juárez', countryCode: 'MX' },
  { code: 'CUN', name: 'Cancún', countryCode: 'MX' },

  // 🇦🇷 Argentina
  { code: 'EZE', name: 'Buenos Aires - Ezeiza', countryCode: 'AR' },

  // 🇨🇱 Chile
  { code: 'SCL', name: 'Santiago - Arturo Merino Benítez', countryCode: 'CL' },

  // 🇯🇵 Japan
  { code: 'NRT', name: 'Tokyo - Narita', countryCode: 'JP' },
  { code: 'HND', name: 'Tokyo - Haneda', countryCode: 'JP' },
  { code: 'KIX', name: 'Osaka - Kansai', countryCode: 'JP' },

  // 🇰🇷 South Korea
  { code: 'ICN', name: 'Seoul - Incheon', countryCode: 'KR' },

  // 🇹🇭 Thailand
  { code: 'BKK', name: 'Bangkok - Suvarnabhumi', countryCode: 'TH' },

  // 🇹🇷 Turkey
  { code: 'IST', name: 'Istanbul Airport', countryCode: 'TR' },

  // 🇦🇪 UAE
  { code: 'DXB', name: 'Dubai International', countryCode: 'AE' },

  // 🇸🇬 Singapore
  { code: 'SIN', name: 'Singapore Changi', countryCode: 'SG' },

  // 🌍 Africa
  { code: 'CMN', name: 'Casablanca - Mohammed V', countryCode: 'MA' },
  { code: 'RAK', name: 'Marrakech - Menara', countryCode: 'MA' },
  { code: 'TUN', name: 'Tunis - Carthage', countryCode: 'TN' },
  { code: 'ALG', name: 'Algiers - Houari Boumediene', countryCode: 'DZ' },
  { code: 'CAI', name: 'Cairo International', countryCode: 'EG' },
  { code: 'JNB', name: 'Johannesburg - OR Tambo', countryCode: 'ZA' },
  { code: 'CPT', name: 'Cape Town International', countryCode: 'ZA' },
  { code: 'NBO', name: 'Nairobi - Jomo Kenyatta', countryCode: 'KE' },
  { code: 'DSS', name: 'Dakar - Blaise Diagne', countryCode: 'SN' },
  { code: 'LOS', name: 'Lagos - Murtala Muhammed', countryCode: 'NG' }
];




  visitedCountries: string[] = [];
  
  percentVisited: number = 0;

  upcomingFlights: Flight[] = [];
  wishlistCountries: string[] = [];
  wishlistAbierto: boolean = false;
  nuevoDestino: string = '';

  viewDate: Date = new Date();
 

  constructor(private vueloService: VueloService, private userService: UserService) {}

  ngOnInit(): void {
    

  
  const userData = localStorage.getItem('tickety-user');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('USER DATA:', user);
    this.cargarDatosPanel(Number(user.userId)); // should show { email, userId, token }
   
    
  }
  
}


 cargarDatosPanel(userId: number): void {
  this.userService.getWishlist(userId).subscribe({
    next: (wishlist: string[]) => {
      this.wishlistCountries = wishlist;

      this.vueloService.getFlightsByUser(userId).subscribe({
        next: (flights: Flight[]) => {
          const today = new Date();
          const visitedSet = new Set<string>();
          const upcomingSet = new Set<string>();

          this.upcomingFlights = [];
          const calendarEvents: EventInput[] = [];


          flights.forEach(flight => {
            const isUpcoming = new Date(flight.flightDate) >= today;
            const departureCountry = this.obtenerPaisPorCodigo(flight.departureAirport);
            const arrivalCountry = this.obtenerPaisPorCodigo(flight.arrivalAirport);

            if (!departureCountry || !arrivalCountry) return;

            if (isUpcoming) {
              upcomingSet.add(departureCountry);
              upcomingSet.add(arrivalCountry);
              this.upcomingFlights.push(flight);
            } else {
              visitedSet.add(departureCountry);
              visitedSet.add(arrivalCountry);
            }

            calendarEvents.push({
              title: `✈️ ${flight.departureAirport} → ${flight.arrivalAirport}`,
              date: flight.flightDate
            });
          });

          this.calendarOptions.events = calendarEvents;

          this.visitedCountries = Array.from(visitedSet);
          this.percentVisited = Math.round((this.visitedCountries.length / 195) * 100);

          const wishlistOnly = this.wishlistCountries.filter(
            code => !visitedSet.has(code) && !upcomingSet.has(code)
          );

          setTimeout(() => {
            this.initMap(this.visitedCountries, Array.from(upcomingSet), wishlistOnly);
          }, 0);
        },
        error: err => console.error('Error fetching flights:', err)
      });
    },
    error: err => console.error('Error fetching wishlist:', err)
  });
}



initMap(visitedCountries: string[], upcomingCountries: string[], wishlistCountries: string[]): void {
  this.map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [0, 20],
    zoom: 1.3
  });

  this.map.on('load', async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const geoData: FeatureCollection = await response.json();

      geoData.features.forEach((f) => {
        if (f.properties?.['name'] === 'France' && f.properties['ISO3166-1-Alpha-2'] === '-99') {
          f.properties['ISO3166-1-Alpha-2'] = 'FR';
        }
      });

      const visitedFiltered: FeatureCollection = {
        type: 'FeatureCollection',
        features: geoData.features.filter(f =>
          visitedCountries.includes(f.properties?.['ISO3166-1-Alpha-2'])
        )
      };

      const upcomingFiltered: FeatureCollection = {
        type: 'FeatureCollection',
        features: geoData.features.filter(f =>
          upcomingCountries.includes(f.properties?.['ISO3166-1-Alpha-2'])
        )
      };

      const wishlistFiltered: FeatureCollection = {
        type: 'FeatureCollection',
        features: geoData.features.filter(f =>
          wishlistCountries.includes(f.properties?.['ISO3166-1-Alpha-2'])
        )
      };

      // 🔴 Visited
      this.map!.addSource('visited-countries', { type: 'geojson', data: visitedFiltered });
      this.map!.addLayer({
        id: 'visited-layer',
        type: 'fill',
        source: 'visited-countries',
        paint: {
          'fill-color': '#ff9999',
          'fill-opacity': 0.6
        }
      });

      // 🔵 Upcoming
      this.map!.addSource('upcoming-countries', { type: 'geojson', data: upcomingFiltered });
      this.map!.addLayer({
        id: 'upcoming-layer',
        type: 'fill',
        source: 'upcoming-countries',
        paint: {
          'fill-color': '#2196f3',
          'fill-opacity': 0.6
        }
      });

      // 🟡 Wishlist
      this.map!.addSource('wishlist-countries', { type: 'geojson', data: wishlistFiltered });
      this.map!.addLayer({
        id: 'wishlist-layer',
        type: 'fill',
        source: 'wishlist-countries',
        paint: {
          'fill-color': '#ffcc00',
          'fill-opacity': 0.5
        }
      });

      // Auto-zoom to all features
      const allFeatures = [
        ...visitedFiltered.features,
        ...upcomingFiltered.features,
        ...wishlistFiltered.features
      ];

      const bounds = new maplibregl.LngLatBounds();
      allFeatures.forEach((f: Feature) => {
        const coords = (f.geometry as any).coordinates.flat(Infinity);
        coords.forEach((coord: any) => {
          if (Array.isArray(coord) && coord.length === 2) {
            bounds.extend(coord as [number, number]);
          }
        });
      });

      if (!bounds.isEmpty()) {
        this.map!.fitBounds(bounds, { padding: 30 });
      }
    } catch (err) {
      console.error('❌ Error loading or processing GeoJSON:', err);
    }
  });
  setTimeout(() => {
  this.map!.resize();
}, 100);

}





  obtenerPaisPorCodigo(codigo: string): string {
  const airport = this.airportOptions.find(a => a.code === codigo);
  return airport?.countryCode || '';
}

  abrirModalWishlist(): void {
  this.wishlistAbierto = true;
}

cerrarModalWishlist(): void {
  this.wishlistAbierto = false;
  this.nuevoDestino = '';
}

addToWishlist(): void {
  const name = this.nuevoDestino.trim().toLowerCase();
  if (!name) return;

  const nameToCodeMap: Record<string, string> = {
     'españa': 'ES', 'espana': 'ES', 'madrid': 'ES', 'barcelona': 'ES', 'sevilla': 'ES', 'valencia': 'ES',

  // 🇫🇷 France
  'francia': 'FR', 'paris': 'FR', 'lyon': 'FR', 'marsella': 'FR', 'niza': 'FR',

  // 🇩🇪 Germany
  'alemania': 'DE', 'alemannie': 'DE', 'berlin': 'DE', 'frankfurt': 'DE', 'munich': 'DE', 'múnich': 'DE',

  // 🇮🇹 Italy
  'italia': 'IT', 'roma': 'IT', 'napoles': 'IT', 'napoli': 'IT', 'venecia': 'IT', 'milan': 'IT', 'milán': 'IT',

  // 🇬🇧 United Kingdom
  'reino unido': 'GB', 'inglaterra': 'GB', 'londres': 'GB', 'manchester': 'GB', 'escocia': 'GB', 'edimburgo': 'GB',

  // 🇺🇸 USA
  'estados unidos': 'US', 'eeuu': 'US', 'new york': 'US', 'nueva york': 'US', 'miami': 'US', 'los angeles': 'US', 'chicago': 'US',

  // 🇨🇦 Canada
  'canadá': 'CA', 'canada': 'CA', 'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA',

  // 🇲🇽 Mexico
  'méxico': 'MX', 'mexico': 'MX', 'cancún': 'MX', 'cancun': 'MX', 'cdmx': 'MX',

  // 🇧🇷 Brazil
  'brasil': 'BR', 'rio': 'BR', 'rio de janeiro': 'BR', 'sao paulo': 'BR', 'são paulo': 'BR',

  // 🇦🇷 Argentina
  'argentina': 'AR', 'buenos aires': 'AR',

  // 🇨🇱 Chile
  'chile': 'CL', 'santiago': 'CL',

  // 🇵🇪 Peru
  'perú': 'PE', 'peru': 'PE', 'lima': 'PE',

  // 🇨🇴 Colombia
  'colombia': 'CO', 'bogotá': 'CO', 'bogota': 'CO',

  // 🇯🇵 Japan
  'japon': 'JP', 'japón': 'JP', 'tokyo': 'JP', 'osaka': 'JP',

  // 🇰🇷 South Korea
  'corea del sur': 'KR', 'corea': 'KR', 'seul': 'KR', 'seúl': 'KR',

  // 🇨🇳 China
  'china': 'CN', 'pekin': 'CN', 'pekín': 'CN', 'beijing': 'CN', 'shanghái': 'CN', 'shanghai': 'CN',

  // 🇮🇳 India
  'india': 'IN', 'delhi': 'IN', 'nueva delhi': 'IN', 'mumbai': 'IN',

  // 🇹🇭 Thailand
  'tailandia': 'TH', 'bangkok': 'TH',

  // 🇸🇬 Singapore
  'singapur': 'SG',

  // 🇹🇷 Turkey
  'turquía': 'TR', 'turquia': 'TR', 'estambul': 'TR', 'istanbul': 'TR',

  // 🇦🇪 UAE
  'dubai': 'AE', 'emiratos': 'AE', 'emiratos árabes': 'AE', 'emiratos arabes': 'AE', 'abudhabi': 'AE', 'abu dhabi': 'AE',

  // 🌍 Africa
  'marruecos': 'MA', 'casablanca': 'MA', 'marrakech': 'MA',
  'túnez': 'TN', 'tunez': 'TN',
  'egipto': 'EG', 'el cairo': 'EG', 'cairo': 'EG',
  'sudáfrica': 'ZA', 'sudafrica': 'ZA', 'johannesburgo': 'ZA', 'ciudad del cabo': 'ZA',
  'kenia': 'KE', 'nairobi': 'KE',
  'senegal': 'SN', 'dakar': 'SN',
  'nigeria': 'NG', 'lagos': 'NG',

  // 🇮🇸 Iceland
  'islandia': 'IS', 'reykjavik': 'IS',

  // 🇳🇴 Norway
  'noruega': 'NO', 'oslo': 'NO',

  // 🇸🇪 Sweden
  'suecia': 'SE', 'estocolmo': 'SE',

  // 🇫🇮 Finland
  'finlandia': 'FI', 'helsinki': 'FI',

  // 🇵🇹 Portugal
  'portugal': 'PT', 'lisboa': 'PT', 'lisbon': 'PT', 'porto': 'PT',

  // 🇬🇷 Greece
  'grecia': 'GR', 'atenas': 'GR',

  // 🇳🇱 Netherlands
  'paises bajos': 'NL', 'países bajos': 'NL', 'holanda': 'NL', 'amsterdam': 'NL',

  // 🇨🇭 Switzerland
  'suiza': 'CH', 'zurich': 'CH', 'ginebra': 'CH',

  // 🇦🇹 Austria
  'austria': 'AT', 'viena': 'AT',

  // 🇧🇪 Belgium
  'bélgica': 'BE', 'belgica': 'BE', 'bruselas': 'BE',

  // 🇵🇱 Poland
  'polonia': 'PL', 'varsovia': 'PL',

  // 🇭🇺 Hungary
  'hungría': 'HU', 'hungria': 'HU', 'budapest': 'HU',

  // 🇨🇿 Czech Republic
  'chequia': 'CZ', 'república checa': 'CZ', 'praga': 'CZ',

  // 🇷🇴 Romania
  'rumanía': 'RO', 'rumania': 'RO', 'bucarest': 'RO',

  // 🇲🇹 Malta
  'malta': 'MT',

  // 🇮🇪 Ireland
  'irlanda': 'IE', 'dublín': 'IE', 'dublin': 'IE',

     // 🇵🇸 Palestine
  'palestina': 'PS', 'cisjordania': 'PS', 'jerusalén este': 'PS', 'jerusalen este': 'PS', 'gaza': 'PS', 'ramala': 'PS', 'nablus': 'PS', 'hebrón': 'PS', 'hebron': 'PS',

   // 🇸🇦 Saudi Arabia
  'arabia saudi': 'SA', 'arabia saudita': 'SA', 'riad': 'SA', 'riyadh': 'SA', 'la meca': 'SA', 'meca': 'SA',

  // 🇯🇴 Jordan
  'jordania': 'JO', 'amman': 'JO', 'petra': 'JO',

  // 🇱🇧 Lebanon
  'líbano': 'LB', 'libano': 'LB', 'beirut': 'LB',

  // 🇮🇷 Iran
  'irán': 'IR', 'iran': 'IR', 'teherán': 'IR', 'teheran': 'IR',

  // 🇶🇦 Qatar
  'qatar': 'QA', 'doha': 'QA',

  // 🇴🇲 Oman
  'oman': 'OM', 'mascate': 'OM', 'muscat': 'OM',

  // 🇰🇼 Kuwait
  'kuwait': 'KW',

  // 🇧🇭 Bahrain
  'baréin': 'BH', 'barein': 'BH',

  // 🇯🇴 United Arab Emirates (already partially added)
     // 🇦🇺 Australia
  'australia': 'AU', 'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU',

  // 🇳🇿 New Zealand
  'nueva zelanda': 'NZ', 'new zealand': 'NZ', 'auckland': 'NZ', 'wellington': 'NZ', 'queenstown': 'NZ',

  // 🇫🇯 Fiji
  'fiyi': 'FJ', 'fiji': 'FJ',

  // 🇵🇫 French Polynesia
  'polinesia francesa': 'PF', 'tahiti': 'PF',
      // 🇨🇺 Cuba
  'cuba': 'CU', 'la habana': 'CU', 'habana': 'CU',

  // 🇩🇴 Dominican Republic
  'república dominicana': 'DO', 'republica dominicana': 'DO', 'punta cana': 'DO', 'santo domingo': 'DO',

  // 🇵🇷 Puerto Rico
  'puerto rico': 'PR', 'san juan': 'PR',

  // 🇯🇲 Jamaica
  'jamaica': 'JM', 'kingston': 'JM', 'montego bay': 'JM',

  // 🇧🇸 Bahamas
  'bahamas': 'BS', 'nassau': 'BS',

  // 🇲🇶 Martinique
  'martinica': 'MQ',

  // 🇬🇵 Guadeloupe
  'guadalupe': 'GP',

  // 🇹🇹 Trinidad and Tobago
  'trinidad y tobago': 'TT', 'trinidad': 'TT', 'puerto españa': 'TT',


};

  const iso = nameToCodeMap[name];
  if (!iso) {
    alert('País no reconocido.');
    return;
  }

  if (this.wishlistCountries.includes(iso)) {
    alert('Este país ya está en tu wishlist.');
    return;
  }

  // Add to the wishlist array
  this.wishlistCountries.push(iso);
  this.nuevoDestino = '';

  // Save to backend
  const userData = localStorage.getItem('tickety-user');
  if (userData) {
    const user = JSON.parse(userData);
    this.userService.updateWishlist(user.userId, this.wishlistCountries).subscribe({
      next: () => {
        this.cargarDatosPanel(Number(user.userId)); // Refresh map & KPIs
      },
      error: err => {
        console.error('Error al guardar la wishlist:', err);
        alert('Error al guardar la wishlist.');
      }
    });
  }
}





eliminarDeWishlist(index: number): void {
  const removed = this.wishlistCountries.splice(index, 1)[0];

  const userData = localStorage.getItem('tickety-user');
  if (userData) {
    const user = JSON.parse(userData);
    this.userService.updateWishlist(user.userId, this.wishlistCountries).subscribe({
      next: () => {
        this.cargarDatosPanel(Number(user.userId));
      },
      error: err => {
        console.error('Error al eliminar de la wishlist:', err);
        alert('Error al actualizar la wishlist.');
        // Restore the item in case of failure
        this.wishlistCountries.splice(index, 0, removed);
      }
    });
  }
}


handleEventClick(arg: any): void {
  // Optional: you can get data from the clicked event
  const flight = arg.event;

  // Optionally log what was clicked
  console.log('Clicked flight:', flight.title, flight.start);

  // Redirect to "Mis Vuelos"
  window.location.href = '/client/mis-vuelos';
}

}


