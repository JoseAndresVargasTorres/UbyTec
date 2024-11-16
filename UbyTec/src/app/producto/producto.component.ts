import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
[x: string]: any;
  negocioId!: number;

  productos = [
    { id: 1, nombre: 'Producto A', precio: 100 },
    { id: 2, nombre: 'Producto B', precio: 150 },
    { id: 3, nombre: 'Producto C', precio: 200 },
  ];

  constructor(private route: ActivatedRoute) {
    // Obtener el id del negocio desde la URL
    this.route.params.subscribe(params => {
      this.negocioId = +params['id'];
    });
  }

  agregarAlCarrito(producto: any) {
    // Recuperar el carrito desde localStorage, o crear uno vacío si no existe
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Agregar el producto al carrito
    carrito.push(producto);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.nombre} ha sido añadido al carrito.`);
  }
}
