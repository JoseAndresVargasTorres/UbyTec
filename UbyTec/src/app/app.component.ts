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
    {
      path: 'negocio/:id',
      loadComponent: () =>
        import('./producto/producto.component').then((m) => m.ProductoComponent),
    },
    {
      path: 'carrito',
      loadComponent: () =>
        import('./carrito/carrito.component').then((m) => m.CarritoComponent),
    },
    {
      path: 'gestion-clientes',
      loadComponent: () =>
        import('./gestion-clientes/gestion-clientes.component').then((m) => m.GestionClientesComponent),
    },
  ];
}
