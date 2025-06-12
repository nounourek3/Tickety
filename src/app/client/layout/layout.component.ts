import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from "../header-client/header-client.component";
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [RouterModule, HeaderClientComponent, NgIf],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  loggedIn = false;
  ready = false;

   constructor(private authService: AuthService) {
    this.authService.isReady().subscribe((ready) => {
      this.ready = ready;
    });

    this.authService.getLoggedInObservable().subscribe((isLoggedIn) => {
      this.loggedIn = isLoggedIn;
    });
  }
}
