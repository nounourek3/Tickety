import { Component } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent {
  isModalOpen = false;
  tripEmail: string = '';
  trips: any[] = []; // Holds all imported trips
  copiado = false;

  constructor(private popupService: PopupService) {}

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  importTripMock(): void {
    // Populating mock data for "Ida" (departure) and "Vuelta" (return)
    const idaTrip = {
      type: 'Ida',
      origin: 'MAD Madrid',
      destination: 'NRT Tokyo',
      date: 'Sab, Dic 28',
      departureTime: '10:00 AM',
      landingTime: '2:00 PM',
      airline: 'Airline X',
      flightNumber: 'AX1234',
      bookingNumber: 'ABC123456',
      passengerNames: 'Juan Pérez, María Gómez'
    };

    const vueltaTrip = {
      type: 'Vuelta',
      origin: 'NRT Tokyo',
      destination: 'MAD Madrid',
      date: 'Sab, Ene 5',
      departureTime: '4:00 PM',
      landingTime: '6:00 AM',
      airline: 'Airline X',
      flightNumber: 'AX5678',
      bookingNumber: 'DEF789123',
      passengerNames: 'Juan Pérez, María Gómez'
    };

    // Adding both trips (Ida and Vuelta) to the trips array
    this.trips.push(idaTrip, vueltaTrip);
    
    this.closeModal(); // Close the modal once the trips are imported
  }

  handleThumbsUp(): void {
    this.popupService.showMessage('¡Todo está correcto!', 'El viaje ha sido confirmado exitosamente.', 'success');
  }

  async handleThumbsDown(): Promise<void> {
    const confirmed = await this.popupService.showConfirmation(
      'Reintentar Importar',
      '¿Deseas reenviar el correo con la confirmación del viaje?'
    );
    if (confirmed) {
      this.isModalOpen = true;
    } else {
      this.popupService.showMessage('No se ha realizado ningún cambio.', 'El viaje no fue reenviado.', 'info');
    }
  }

  copiarEmail(): void {
    const email = 'viajestickety@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    });
  }
}
