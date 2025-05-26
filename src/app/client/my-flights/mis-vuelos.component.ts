import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupService } from './../../services/popup.service';
import { Flight, VueloService } from '../../services/vuelo.service';
import { Router } from '@angular/router';
import { ConfirmFlightComponent } from '../confirm-flight/confirm-flight.component';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmFlightComponent
  ],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit {
  userId = Number(localStorage.getItem('userId')) || 0;
  myFlights: Flight[] = [];
  emails: any[] = []; // 🆕 List of flight emails
  copiado = false;

  isModalOpen = false;
  selectedEmailId: number | null = null;
  parsedFlight: any = null;

  constructor(
    private flightService: VueloService,
    private popupService: PopupService,
    private router: Router,
    private tokenService: TokenService,
    private vueloService: VueloService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUser()?.userId; // ✅ Clean and safe

    if (!this.userId || isNaN(this.userId)) {
      this.popupService.showMessage('No estás autenticado', 'Por favor, inicia sesión.', 'error');
      return;
    }

    this.refreshFlights();
    this.loadEmails(); // 🆕 load flightEmails
  }

refreshFlights(): void {
  const userId = this.tokenService.getUser()?.userId;

  if (!userId) {
    console.warn('❗No user ID found, cannot refresh flights.');
    return;
  }

  this.vueloService.getFlightsByUser(userId).subscribe({
  next: (flights: Flight[]) => {
  console.log('📦 ALL flights received (before filter):', flights);

  this.myFlights = flights.filter(f =>
    f.flightNumber &&
    f.departureAirport &&
    f.arrivalAirport &&
    f.flightDate &&
    f.departureTime &&
    f.arrivalTime
  );

  console.log('✈️ Refreshed VALID flights:', this.myFlights);
},

  error: (err) => console.error('❌ Error loading flights:', err)
});
}


 loadEmails(): void {
  this.flightService.getEmailsByUser(this.userId).subscribe(
    emails => {
      console.log("📩 Emails fetched from backend:", emails);
      this.emails = emails;
    },
    () => this.popupService.showMessage('Error', 'No se pudieron cargar los correos.', 'error')
  );
}


  openCrearTarjeta(emailId: number): void {
    this.selectedEmailId = emailId;
    this.flightService.parseFlightEmail(emailId).subscribe(data => {
      this.parsedFlight = { ...data, id: emailId }; // include ID for saving
      this.isModalOpen = true;
    }, () => {
      this.popupService.showMessage('Error al analizar el correo', 'No se pudo extraer la información del vuelo.', 'error');
    });
  }

 onFlightSaved(): void {
  this.popupService.showMessage('¡Vuelo guardado!', 'Tu tarjeta de embarque ha sido añadida.', 'success');

  this.refreshFlights();

  // ⏳ Wait a moment before closing the modal (to allow DOM update)
  setTimeout(() => {
    this.closeModal();
  }, 200); // 200ms is usually enough
}



  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmailId = null;
    this.parsedFlight = null;
  }

  copiarEmail(): void {
    const email = `viajestickety+${this.userId}@yourdomain.com`;
    navigator.clipboard.writeText(email).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 6000);
    }).catch(err => {
      console.error('Error copying to clipboard: ', err);
    });
  }
}
