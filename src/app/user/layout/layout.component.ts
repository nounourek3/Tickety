import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-layout',
  imports: [ RouterModule, HeaderUserComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
