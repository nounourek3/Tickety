import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RegisterRequest } from '../../interfaces/register-request';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username='';
  email='';
  password='';
  confirmPassword='';
  errorMessage='';

  constructor(private authService: AuthService, private router: Router){}

  register() {
  if (!this.username || !this.email || !this.password || !this.confirmPassword) {
    this.errorMessage = "Todos los campos son obligatorios";
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.errorMessage = "Las contraseñas no coinciden.";
    return;
  }

  const data: RegisterRequest = {
    username: this.username,
    email: this.email,
    password: this.password
  };

  this.authService.register(data).subscribe({
    next: (response: any) => {
      const token = response?.token;
      const userId = response?.userId;

      if (!token || userId === undefined || userId === null) {
        this.errorMessage = "❌ Registro inválido (token o userId faltante)";
        return;
      }

      this.authService.saveUserSession({ email: this.email, userId, token });
      this.router.navigate(['/client']);
    },
    error: () => {
      this.errorMessage = 'Este usuario ya existe o ha ocurrido un error';
    }
  });
}
}
