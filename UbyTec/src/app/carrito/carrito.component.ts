import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carrito: any[] = [];

  constructor() {
    // Recuperar el carrito desde localStorage
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  get totalPrecio(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  vaciarCarrito() {
    // Vaciar el carrito en el localStorage
    localStorage.removeItem('carrito');
    this.carrito = []; // Limpiar la vista
  }

  eliminarProducto(index: number) {
    // Eliminar producto del carrito por su índice
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Actualizar localStorage
  }
}
