import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VueloService } from '../../services/vuelo.service';

@Component({
  selector: 'app-confirm-flight',
  templateUrl: './confirm-flight.component.html',
  styleUrl: './confirm-flight.component.scss',
  standalone: true,
  imports: [FormsModule]
})
export class ConfirmFlightComponent implements OnChanges {
  @Input() email: any = null;
  @Input() userId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() flightSaved = new EventEmitter<void>();

  form: any = {
    flightNumber: '',
    bookingCode: '',
    departureAirport: '',
    arrivalAirport: '',
    flightDate: '',
    departureTime: '',
    arrivalTime: ''
  };

  constructor(private vueloService: VueloService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && this.email) {
      this.form = {
        flightNumber: this.email.flightNumber || '',
        bookingCode: this.email.bookingCode || '',
        departureAirport: this.email.departureAirport || '',
        arrivalAirport: this.email.arrivalAirport || '',
        flightDate: this.email.flightDate || '',
        departureTime: this.email.departureTime || '',
        arrivalTime: this.email.arrivalTime || ''
      };
    }
  }

  submit() {
    const fields = [
      this.form.flightNumber,
      this.form.bookingCode,
      this.form.departureAirport,
      this.form.arrivalAirport,
      this.form.flightDate,
      this.form.departureTime,
      this.form.arrivalTime
    ];

    if (fields.some(field => !field || field.trim() === '')) {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
      return;
    }

    const payload = {
      userId: this.userId,
      flightEmailId: this.email?.id,
      ...this.form
    };

    console.log('Payload before sending:', payload);

    this.vueloService.saveFlight(payload).subscribe({
      next: () => {
        this.flightSaved.emit();
        this.close();
      },
      error: err => {
  if (err.status === 409) {
    alert('⚠️ Este vuelo ya ha sido guardado previamente.');
  } else {
    console.error('❌ Error inesperado al guardar vuelo:', err);
    alert('❌ Error al guardar el vuelo.');
  }
}

    });
  }

  close() {
    this.closed.emit();
  }
}
