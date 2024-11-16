import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carrito: any[] = [];

  // Datos de la tarjeta de crédito
  tarjeta = {
    numero: '',
    cvv: '',
    vencimiento: '',
    nombre: ''
  };

  constructor() {
    // Recuperar el carrito desde localStorage
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  // Total del carrito
  get totalPrecio(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  // Total del carrito con un 5% extra de servicio
  get totalConServicio(): number {
    return this.totalPrecio * 1.05;
  }

  vaciarCarrito() {
    localStorage.removeItem('carrito');
    this.carrito = [];
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  procesarPago() {
    if (
      this.tarjeta.numero &&
      this.tarjeta.cvv &&
      this.tarjeta.vencimiento &&
      this.tarjeta.nombre
    ) {
      alert('Pago procesado correctamente.');
      this.vaciarCarrito();
    } else {
      alert('Por favor, complete todos los campos de la tarjeta.');
    }
  }
}
