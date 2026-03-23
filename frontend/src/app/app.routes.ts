import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', loadComponent: () => import("./components/users/users.component").then(m => m.UsersComponent) },
  { path: '**', redirectTo: '' }
];
