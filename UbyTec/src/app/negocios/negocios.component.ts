import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-negocios',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.css']
})
export class NegociosComponent {
  negocios = [
    { id: 1, nombre: 'Negocio 1' },
    { id: 2, nombre: 'Negocio 2' },
    { id: 3, nombre: 'Negocio 3' },
  ];

  compras = [
    { comercio: 'Negocio 1', montoGastado: 120, comentario: 'Excelente servicio!' },
    { comercio: 'Negocio 2', montoGastado: 50, comentario: 'Muy buen precio.' },
    { comercio: 'Negocio 3', montoGastado: 200, comentario: 'El producto es de calidad.' },
    { comercio: 'Negocio 1', montoGastado: 75, comentario: 'Muy satisfecho con la compra.' },
    { comercio: 'Negocio 2', montoGastado: 130, comentario: 'Recomiendo el lugar.' },
    { comercio: 'Negocio 3', montoGastado: 60, comentario: 'Atención rápida.' },
    { comercio: 'Negocio 1', montoGastado: 90, comentario: 'Buena variedad de productos.' },
    { comercio: 'Negocio 2', montoGastado: 45, comentario: 'Excelente experiencia de compra.' },
    { comercio: 'Negocio 3', montoGastado: 150, comentario: 'Me encanta el servicio.' },
    { comercio: 'Negocio 1', montoGastado: 200, comentario: 'Muy recomendados.' },
  ];

  constructor(private router: Router) {}

  verProductos(negocioId: number) {
    // Redirige a la página de productos del negocio seleccionado
    this.router.navigate(['/negocio', negocioId]);
  }
}
