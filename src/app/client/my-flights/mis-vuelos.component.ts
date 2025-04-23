import { PopupService } from './../../services/popup.service';
import { TripService } from './../../trip.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Trip } from '../../trip';


@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [FormsModule, CommonModule] ,
  templateUrl: './mis-vuelos.component.html',
  styleUrls: ['./mis-vuelos.component.scss']
})
export class MisVuelosComponent implements OnInit{
  isModalOpen=false;
  trips: Trip[]=[];
  userId=1;
  copiado=false;
  constructor(private tripService: TripService, private PopupService: PopupService){}
  
  ngOnInit(): void {
    this.fetchTrips();
  }
  fetchTrips():void{
    this.tripService.getTripsByUserId(this.userId).subscribe({
      next:(data)=>(this.trips=data),
      error:(err)=>console.error('Error fetching trips', err)
    });
  }
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleThumbsUp(): void {
    this.PopupService.showMessage('¡Todo está correcto!', 'El viaje ha sido confirmado exitosamente.', 'success');
  }
  async handleThumbsDown(): Promise<void> {
    const confirmed = await this.PopupService.showConfirmation(
      'Reintentar Importar',
      '¿Deseas reenviar el correo con la confirmación del viaje?'
    );
    if (confirmed) {
      this.isModalOpen = true;
    } else {
      this.PopupService.showMessage('No se ha realizado ningún cambio.', 'El viaje no fue reenviado.', 'info');
    }
  }
  copiarEmail():void{
    const email= `viajestickety+${this.userId}@gmail.com`;
    navigator.clipboard.writeText(email).then(()=>{
      this.copiado=true;
      setTimeout(()=>(this.copiado=false), 2000);
    })
  }
}
 