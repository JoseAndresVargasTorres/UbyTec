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
  retroalimentacionVisible = false;
  retroalimentacion = '';
  historialComentarios: { comentario: string; fecha: Date }[] = [];

  tarjeta = {
    numero: '',
    cvv: '',
    vencimiento: '',
    nombre: ''
  };

  constructor() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  get totalPrecio(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

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
    if (this.carrito.length === 0) {
      alert('El carrito está vacío. Añade productos antes de procesar el pago.');
      return;
    }

    if (
      this.tarjeta.numero &&
      this.tarjeta.cvv &&
      this.tarjeta.vencimiento &&
      this.tarjeta.nombre
    ) {
      alert('Pago procesado correctamente.');
      this.vaciarCarrito();
      this.retroalimentacionVisible = true; // Mostrar formulario de retroalimentación
    } else {
      alert('Por favor, complete todos los campos de la tarjeta.');
    }
  }

  enviarRetroalimentacion() {
    if (this.retroalimentacion.trim()) {
      this.historialComentarios.push({
        comentario: this.retroalimentacion,
        fecha: new Date()
      });
      alert('¡Gracias por tu retroalimentación!');
      this.retroalimentacion = '';
      this.retroalimentacionVisible = false;
    } else {
      alert('Por favor, escribe tu retroalimentación.');
    }
  }
}
