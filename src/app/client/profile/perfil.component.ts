import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../services/vuelo.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule, NgClass, NgIf, NgFor],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  constructor(
    private vueloService: VueloService,
    private http: HttpClient,
    private popupService: PopupService,
  ) {}

  userId: number = 0;
  user={
    username:'',
    email:'',
    password:'',
  }
  profileImageUrl: string = '';
  totalFlights: number = 0;
  editMode: boolean = false;
  showPassword: boolean = false;
  confirmPassword: string = '';
  communityStories = [
  {
    userName: 'María',
    userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Madrid',
    destinationImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    message: 'Estoy planificando un viaje a Vietnam este verano 🌴✈️ ¿Quién se une desde Madrid?'
  },
  {
    userName: 'Carlos',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Sevilla',
    destinationImage: '/patagonia.jpg',


    message: 'Explorando la Patagonia este otoño 🍂 buscando compañeros de aventura con botas y alma libre.'
  },
  {
    userName: 'Laura',
    userImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Barcelona',
    destinationImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    message: '¿Mochilear por el Sudeste Asiático en diciembre? 🧳 Ya estoy armando la ruta con cero miedo.'
  }
];





  ngOnInit() {
    const authData = JSON.parse(localStorage.getItem('tickety-user') || '{}');
this.userId = authData.userId || 0;


    this.vueloService.getFlightsByUser(this.userId).subscribe((flights) => {
      this.totalFlights = flights.length;
    });

    this.getUserProfile();
  }

  toggleEdit() {
  if (this.editMode) {
    this.saveProfile();
  } else {
    this.editMode = true;
  }
}

  saveProfile() {
  if (this.user.password && this.user.password !== this.confirmPassword) {
    alert('❌ Las contraseñas no coinciden.');
    return;
  }

  this.http.patch(`http://localhost:8080/api/user/${this.userId}`, {
    email: this.user.email,
    password: this.user.password,
    username: this.user.username

     
  }).subscribe({
    next: () => {
  this.popupService.showMessage(
  'Perfil actualizado',
  'Los cambios se han guardado correctamente.',
  'success'
);

  this.editMode = false;
  this.confirmPassword = '';
  this.user.password = '';
  this.getUserProfile();


    },
    error: (err: HttpErrorResponse) => {
      console.error('❌ Error al guardar perfil:', err.message);
      this.popupService.showMessage(
  'Error al guardar',
  'Hubo un problema al actualizar tu perfil.',
  'error'
);

    }
  });
}



 getUserProfile() {
  console.log('🔍 Fetching profile for userId:', this.userId); // ✅ Añade esto

  this.http.get<any>(`http://localhost:8080/api/user/${this.userId}`).subscribe({
    next: (res) => {
      this.user.email = res.email;
       this.user.username = res.username;
      this.profileImageUrl = `http://localhost:8080${res.profileImageUrl}`;

    },
    error: (err: HttpErrorResponse) => {
      console.error('❌ Error fetching user profile', err.message);
    }
  });
}

  onProfileImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    // 🔧 Use the current user's ID dynamically
    const url = `http://localhost:8080/api/user/profile-picture/${this.userId}`;

   this.http.post<any>(`http://localhost:8080/api/user/profile-picture/${this.userId}`, formData).subscribe(
  (res) => {
    console.log('✅ Upload success:', res);
    this.profileImageUrl = `http://localhost:8080${res.profileImageUrl}?t=${Date.now()}`; // ✅ Full valid URL with cache-busting
  },
  err => console.error('❌ Upload error', err)
)};

}

}