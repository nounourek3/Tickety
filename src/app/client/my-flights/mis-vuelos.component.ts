import { PopupService } from './../../services/popup.service';
import { TripService } from './../../trip.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Trip } from '../../trip';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit {
  isModalOpen = false;
  trips: Trip[] = [];
  userId = 1;
  copiado = false;

  private languageKeywords: { [key: string]: string[] } = {
    en: ['check-in', 'flight', 'boarding', 'reservation'],
    es: ['check-in', 'vuelo', 'embarque', 'reserva'],
    fr: ['enregistrement', 'vol', 'embarquement', 'réservation'],
  };

  constructor(
    private tripService: TripService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    console.log('userId:', this.userId);
    this.fetchTrips();
  }

  private containsKeywords(subject: string, language: string): boolean {
    if (!subject) return false;
    const keywords = this.languageKeywords[language];
    return keywords.some(keyword => subject.toLowerCase().includes(keyword.toLowerCase()));
  }

  fetchTrips(): void {
    this.tripService.getTripsByUserId(this.userId).subscribe({
      next: (data) => {
        this.trips = data;
        // Ensure modal opens after data is loaded
      },
      error: (err) => console.error('Error fetching trips', err)
    });
  }
  
  openModal(): void {
    if (this.userId) {
      this.isModalOpen = true;
    } else {
      console.error('UserId is not available!');
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
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
    console.log('copiarEmail() method called');  // Add this line to ensure it's being triggered
  const email = `viajestickety+${this.userId}@yourdomain.com`;
  navigator.clipboard.writeText(email).then(() => {
    this.copiado = true;
    console.log('copiado:', this.copiado);
    setTimeout(() => {
      this.copiado = false;
      console.log('copiado reset to:', this.copiado);
    }, 6000);
  }).catch(err => {
    console.error('Error copying to clipboard: ', err);
  });
}
}
