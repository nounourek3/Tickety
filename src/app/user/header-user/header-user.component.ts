import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header-user',
  imports: [NgClass],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.scss'
})
export class HeaderUserComponent {
isMenuOpen=true;

toggleNavbar(){
  this.isMenuOpen=!this.isMenuOpen;
}
}
