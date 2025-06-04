import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-user',
  imports: [ NgClass, NgIf],
  standalone:true,
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.scss'
})
export class HeaderUserComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = true;

   ngOnInit(): void {
    this.checkLoginStatus();
  }

 checkLoginStatus(): void {
  if (typeof window !== 'undefined' && localStorage.getItem('tickety-user')) {
    const user = JSON.parse(localStorage.getItem('tickety-user')!);
    this.isLoggedIn = !!user.token;
  } else {
    this.isLoggedIn = false;
  }
}


  toggleNavbar(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('tickety-user'); 
    this.checkLoginStatus();                 // update view
    window.location.href = '/';             // refresh to clear view
  }
}
