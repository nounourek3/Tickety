import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderClientComponent } from "../header-client/header-client.component";


@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [RouterModule, HeaderClientComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

}
