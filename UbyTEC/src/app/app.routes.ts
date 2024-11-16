import { Routes } from '@angular/router';
import { NegociosComponent } from './negocios/negocios.component';

export const routes: Routes = [
  { path: 'negocios', component: NegociosComponent },
  { path: '', redirectTo: '', pathMatch: 'full' }
];
