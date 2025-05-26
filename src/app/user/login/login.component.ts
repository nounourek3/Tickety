import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  standalone:true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService : AuthService, public router : Router, private tokenService: TokenService) {}

  login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response: any) => {
      console.log('✅ Login response:', response);

      const token = response?.token;
      const userId = response?.userId;

      if (!token || userId === undefined || userId === null) {
        console.error('❌ Invalid response: missing token or userId');
        this.errorMessage = 'Error: respuesta inválida del servidor.';
        return;
      }
      

      this.authService.saveUserSession({ email: this.email, userId, token });


      this.router.navigate(['/client/mis-vuelos']);
      
    },
    error: (err) => {
      const message = err.error;
      console.log('Login error:', err.status, message);

      if (err.status === 404 && message === 'USER_NOT_FOUND') {
        this.errorMessage = 'Cuenta no encontrada. ¿Quieres registrarte?';
      } else if (err.status === 401 && message === 'INVALID_PASSWORD') {
        this.errorMessage = 'Contraseña incorrecta.';
      } else {
        this.errorMessage = 'Error desconocido.';
      }
    }
  });
}






private extractErrorMessage(err: any): string {
  try {
    if (typeof err.error === 'string') return err.error;
    if (err.error instanceof ProgressEvent) return 'Network error';
    return JSON.stringify(err.error);
  } catch (e) {
    return 'Unknown error';
  }
}

}


