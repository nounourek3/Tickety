import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {
  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    if (token && email && userId) {
      this.tokenService.saveUser({
        token,
        email,
        userId: Number(userId)
      });

      this.router.navigate(['/client/mis-vuelos']);
    } else {
      // 🔴 En cas d’erreur ou URL incomplète
      this.router.navigate(['/user/login']);
    }
  }
}
