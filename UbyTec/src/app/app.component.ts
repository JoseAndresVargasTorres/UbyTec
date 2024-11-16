import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Define las rutas aquí
  static routes: Routes = [
    {
      path: 'negocios',
      loadComponent: () =>
        import('./negocios/negocios.component').then((m) => m.NegociosComponent),
    },
    // Puedes agregar otras rutas si es necesario
    { path: '', redirectTo: '', pathMatch: 'full' }  // Ruta por defecto
  ];
}
