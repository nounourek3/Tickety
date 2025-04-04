import { Routes } from '@angular/router';
import { LayoutComponent } from './user/layout/layout.component';
import { HomeComponent } from './user/home/home.component';
import { FeaturesComponent } from './user/features/features.component';
import { ContactComponent } from './user/contact/contact.component';
import { PerfilComponent } from './client/profile/perfil.component';
import { MisVuelosComponent } from './client/my-flights/mis-vuelos.component';

export const routes: Routes = [

    //user
    
    {
        path:"", component: LayoutComponent, children:[
            {path: "", component:HomeComponent},
            {path:"como-funciona", component:FeaturesComponent},
            {path: "contacto", component:ContactComponent}
        ]
    },
    {
        path:"usuario", component: LayoutComponent, children:[
            {path:"perfil", component: PerfilComponent},
            {path:"mis-vuelos", component:MisVuelosComponent}
        ]
    }
];
