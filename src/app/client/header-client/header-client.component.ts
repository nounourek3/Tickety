import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-client',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header-client.component.html',
  styleUrl: './header-client.component.scss'
})
export class HeaderClientComponent {
  isMenuOpen = false;

  constructor(private router: Router, private auth: AuthService) {}

  // Toggle navbar for mobile view
  toggleNavbar() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Logout function to navigate to the login page
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }

}
