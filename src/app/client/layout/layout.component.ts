import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderClientComponent } from "../header-client/header-client.component";


@Component({
  selector: 'app-layout',
  imports: [RouterModule, HeaderClientComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
