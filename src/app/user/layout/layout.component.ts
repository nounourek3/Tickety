import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderUserComponent, RouterModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
