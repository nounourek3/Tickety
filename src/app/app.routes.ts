import { Routes } from '@angular/router';
import { LayoutComponent as PublicLayout} from './user/layout/layout.component';
import { HomeComponent } from './user/home/home.component';

import { FeaturesComponent } from './user/features/features.component';
import { ContactComponent } from './user/contact/contact.component';
import { PerfilComponent } from './client/profile/perfil.component';
import { MisVuelosComponent } from './client/my-flights/mis-vuelos.component';
import { authGuard } from './auth.guard';
import { LayoutComponent as ClientLayout} from './client/layout/layout.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { PanelComponent } from './client/panel/panel.component';


export const routes: Routes = [

    //user
    
    {
        path:"", component: PublicLayout, children:[
            {path: "", component:HomeComponent},
            {path:"como-funciona", component:FeaturesComponent},
            {path: "contacto", component:ContactComponent},
            { path: 'login', loadComponent: () => import('./user/login/login.component').then(m => m.LoginComponent) },

            { path: 'registro', loadComponent: () => import('./user/register/register.component').then(m => m.RegisterComponent) },
             { path: 'auth-callback', loadComponent: () => import('./user/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent) }
    ]
  },


        
    
   
    {
  path: "client",
  component: ClientLayout,
  canActivateChild: [authGuard], // ✅ apply guard to all children at once
  children: [
    { path: "perfil", component: PerfilComponent },
    { path: "mis-vuelos", component: MisVuelosComponent },
    { path: "inicio", component: HomeComponent },
    { path: "panel", component: PanelComponent },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
  ]
}

];
