import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VueloService, Flight } from '../../services/vuelo.service';
import { TokenService } from '../../services/token.service';
import { PopupService } from '../../services/popup.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit {
  userId = Number(localStorage.getItem('userId')) || 0;
  myFlights: Flight[] = [];
  copiado = false;
  isAdding = false;
  isRoundTrip: boolean = false;

  upcomingFlights: Flight[] = [];
  pastFlights: Flight[] = [];
  flightForms: { [key: string]: Flight } = {
  ida: {
    flightNumber: '',
    bookingCode: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    flightDate: '',
    airline: '',
    seat: '',
    userId: this.userId
  },
  vuelta: {
    flightNumber: '',
    bookingCode: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    flightDate: '',
    airline: '',
    seat: '',
    userId: this.userId
  }
  
};
selectedFlight:Flight | null = null;


  get defaultFlight(): Flight {
    return {
      flightNumber: '',
      bookingCode: '',
      departureAirport: '',
      arrivalAirport: '',
      departureTime: '',
      arrivalTime: '',
      flightDate: '',
      airline: '',
      seat: '',
      userId: this.userId
    };
  }


  form: Flight = {
    flightNumber: '',
    bookingCode: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    flightDate: '',
    userId: this.userId
  };
airportOptions = [
  // 🇪🇸 Spain
  { code: 'MAD', name: 'Madrid - Barajas' },
  { code: 'BCN', name: 'Barcelona - El Prat' },
  { code: 'AGP', name: 'Málaga - Costa del Sol' },
  { code: 'VLC', name: 'Valencia - Manises' },

  // 🇫🇷 France
  { code: 'ORY', name: 'Paris - Orly' },
  { code: 'CDG', name: 'Paris - Charles de Gaulle' },
  { code: 'NCE', name: 'Nice - Côte d\'Azur' },
  { code: 'LYS', name: 'Lyon - Saint-Exupéry' },

  // 🇮🇹 Italy
  { code: 'FCO', name: 'Rome - Fiumicino' },
  { code: 'MXP', name: 'Milan - Malpensa' },
  { code: 'VCE', name: 'Venice - Marco Polo' },
  { code: 'NAP', name: 'Naples - Capodichino' },

  // 🇩🇪 Germany
  { code: 'FRA', name: 'Frankfurt' },
  { code: 'BER', name: 'Berlin - Brandenburg' },
  { code: 'MUC', name: 'Munich' },
  { code: 'HAM', name: 'Hamburg' },

  // 🇬🇧 United Kingdom
  { code: 'LHR', name: 'London - Heathrow' },
  { code: 'LGW', name: 'London - Gatwick' },
  { code: 'MAN', name: 'Manchester' },
  { code: 'EDI', name: 'Edinburgh' },

  // 🇺🇸 USA
  { code: 'JFK', name: 'New York - JFK' },
  { code: 'EWR', name: 'Newark' },
  { code: 'LAX', name: 'Los Angeles' },
  { code: 'MIA', name: 'Miami' },

  // 🇧🇷 Brazil
  { code: 'GRU', name: 'São Paulo - Guarulhos' },
  { code: 'GIG', name: 'Rio de Janeiro - Galeão' },

  // 🇲🇽 Mexico
  { code: 'MEX', name: 'Mexico City - Benito Juárez' },
  { code: 'CUN', name: 'Cancún' },

  // 🇦🇷 Argentina
  { code: 'EZE', name: 'Buenos Aires - Ezeiza' },

  // 🇨🇱 Chile
  { code: 'SCL', name: 'Santiago - Arturo Merino Benítez' },

  // 🇯🇵 Japan
  { code: 'NRT', name: 'Tokyo - Narita' },
  { code: 'HND', name: 'Tokyo - Haneda' },
  { code: 'KIX', name: 'Osaka - Kansai' },

  // 🇰🇷 South Korea
  { code: 'ICN', name: 'Seoul - Incheon' },

  // 🇹🇭 Thailand
  { code: 'BKK', name: 'Bangkok - Suvarnabhumi' },

  // 🇹🇷 Turkey
  { code: 'IST', name: 'Istanbul Airport' },

  // 🇦🇪 UAE
  { code: 'DXB', name: 'Dubai International' },

  // 🇸🇬 Singapore
  { code: 'SIN', name: 'Singapore Changi' },

  // 🌍 Africa
  { code: 'CMN', name: 'Casablanca - Mohammed V (Morocco)' },
  { code: 'RAK', name: 'Marrakech - Menara (Morocco)' },
  { code: 'TUN', name: 'Tunis - Carthage (Tunisia)' },
  { code: 'ALG', name: 'Algiers - Houari Boumediene (Algeria)' },
  { code: 'CAI', name: 'Cairo International (Egypt)' },
  { code: 'JNB', name: 'Johannesburg - OR Tambo (South Africa)' },
  { code: 'CPT', name: 'Cape Town International (South Africa)' },
  { code: 'NBO', name: 'Nairobi - Jomo Kenyatta (Kenya)' },
  { code: 'DSS', name: 'Dakar - Blaise Diagne (Senegal)' },
  { code: 'LOS', name: 'Lagos - Murtala Muhammed (Nigeria)' }
];



  constructor(
    private vueloService: VueloService,
    private tokenService: TokenService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUser()?.userId;
    if (!this.userId || isNaN(this.userId)) {
      this.popupService.showMessage('No estás autenticado', 'Por favor, inicia sesión.', 'error');
      return;
    }

    this.refreshFlights();
  }

 refreshFlights(): void {
  if (!this.userId) return;

  this.vueloService.getFlightsByUser(this.userId).subscribe({
    next: (flights: Flight[]) => {
      this.myFlights = flights.filter(f =>
        f.flightNumber &&
        f.departureAirport &&
        f.arrivalAirport &&
        f.flightDate &&
        f.departureTime &&
        f.arrivalTime
      );

      // 🧠 Split them into upcoming and past
      this.splitFlights();
    },
    error: (err) => console.error('❌ Error loading flights:', err)
  });
}


 addFlight(leg: string): void {
  const form = this.flightForms[leg];

  const requiredFields = [
    form.flightNumber,
    form.bookingCode,
    form.departureAirport,
    form.arrivalAirport,
    form.flightDate,
    form.departureTime,
    form.arrivalTime
  ];

  if (requiredFields.some(field => !field || field.trim() === '')) {
    this.popupService.showMessage('Campos incompletos', 'Por favor completa todos los campos.', 'error');
    return;
  }

  form.userId = this.userId;

  this.vueloService.saveFlight(form).subscribe({
    next: () => {
      this.popupService.showMessage('Vuelo guardado', `El vuelo de ${leg} ha sido añadido.`, 'success');

      this.flightForms[leg] = {
        flightNumber: '',
        bookingCode: '',
        departureAirport: '',
        arrivalAirport: '',
        departureTime: '',
        arrivalTime: '',
        flightDate: '',
        airline: '',
        seat: '',
        userId: this.userId
      };

      this.refreshFlights();
    },
    error: (err) => {
      console.error('❌ Error al guardar el vuelo:', err);
      this.popupService.showMessage('Error', 'No se pudo guardar el vuelo.', 'error');
    }
  });
}

  splitFlights(): void {
  const today = new Date().toISOString().split('T')[0]; // format: yyyy-MM-dd
  this.upcomingFlights = [];
  this.pastFlights = [];

  for (const flight of this.myFlights) {
    if (flight.flightDate >= today) {
      this.upcomingFlights.push(flight);
    } else {
      this.pastFlights.push(flight);
    }
  }

  this.upcomingFlights.sort((a, b) => a.flightDate.localeCompare(b.flightDate));
  this.pastFlights.sort((a, b) => b.flightDate.localeCompare(a.flightDate));
}

drop(event: CdkDragDrop<Flight[]>, listType: 'upcoming' | 'past'): void {
  if (event.previousContainer === event.container) {
    // ✅ Moved within the same list
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    // ✅ Moved between upcoming ↔ past
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  // 🧠 Optional: console log
  console.log('🟰 upcomingFlights:', this.upcomingFlights);
  console.log('🕰️ pastFlights:', this.pastFlights);
}



hideFlight(flight: Flight): void {
  this.myFlights = this.myFlights.filter(f => f !== flight);
  this.splitFlights();
}
handleFileUpload(event: any, leg: string) {
  const file = event.target.files[0];
  if (file) {
    this.flightForms[leg].pdfFileName = file.name;
    // Optionally store the file object for future upload
  }
}
calculateFlightDuration(departureTime: string, arrivalTime: string): string {
  if (!departureTime || !arrivalTime) return '';
  const [depH, depM] = departureTime.split(':').map(Number);
  const [arrH, arrM] = arrivalTime.split(':').map(Number);

  let dep = new Date(0, 0, 0, depH, depM);
  let arr = new Date(0, 0, 0, arrH, arrM);
  if (arr < dep) arr.setDate(arr.getDate() + 1); // Overnight flight

  const diffMs = arr.getTime() - dep.getTime();
  const hrs = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}
deleteFlight(flight: any) {
  console.log("🛫 Deleting flight with ID:", flight.id); // ✅ should show a real ID, not undefined
  this.vueloService.deleteFlight(flight.id).subscribe(
    () => this.refreshFlights(),
    err => console.error('❌ Error deleting flight:', err)
  );
}
editFlight(flight : Flight){
  console.log("🖊️ Editing flight:", flight);
  this.selectedFlight={...flight};
}
cancelEdit(){
  this.selectedFlight=null;
}
saveEditedFlight() {
  if (!this.selectedFlight || !this.selectedFlight.id) {
    console.error("⛔ Error: selectedFlight is invalid or has no ID:", this.selectedFlight);
    return;
  }

  console.log("📤 Updating flight with ID:", this.selectedFlight.id);

  this.vueloService.updateFlight(this.selectedFlight.id, this.selectedFlight).subscribe({
    next: () => {
      this.refreshFlights();
      this.selectedFlight = null;
    },
    error: err => console.error('❌ Error updating flight:', err)
  });
}





}
