import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-client',
  imports: [FormsModule, CommonModule],
  templateUrl: './header-client.component.html',
  styleUrl: './header-client.component.scss'
})
export class HeaderClientComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  // Toggle navbar for mobile view
  toggleNavbar() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Logout function to navigate to the login page
  logout() {
    // Add your logout logic here (clear token, etc.)
    this.router.navigate(['/login']); 
  }

}
