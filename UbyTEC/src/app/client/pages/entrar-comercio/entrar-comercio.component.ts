import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ComercioAfiliado, Producto, DireccionComercio } from '../../interfaces/allinterfaces';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrar-comercio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderClientComponent,HttpClientModule],
  templateUrl: './entrar-comercio.component.html',
  styleUrl: './entrar-comercio.component.css'
})
export class EntrarComercioComponent implements OnInit {
  // URLs de la API
  private apiUrl = 'http://localhost:5037/api/';

  // Propiedades
  comercios: ComercioAfiliado[] = [];
  productosComercio: Producto[] = [];
  comercioSeleccionado: ComercioAfiliado | null = null;
  direccionComercio: DireccionComercio | null = null;

  filtroForm: FormGroup;
  busquedaProducto: string = '';

  productosCarrito: { producto: Producto, cantidad: number }[] = [];

  cargandoComercios: boolean = false;
  cargandoProductos: boolean = false;
  usarDatosPrueba: boolean = true; // Toggle para usar datos de prueba

  // Datos de prueba
  private mockComercios: ComercioAfiliado[] = [
    {
      cedula_Juridica: "3001123456",
      nombre: "Restaurante El Buen Sabor",
      correo: "buensabor@email.com",
      sinpe: "88776655",
      id_Tipo: 1,
      cedula_Admin: 123456789
    },
    {
      cedula_Juridica: "3001789012",
      nombre: "Super Fresh Market",
      correo: "fresh@email.com",
      sinpe: "87654321",
      id_Tipo: 2,
      cedula_Admin: 987654321
    },
    {
      cedula_Juridica: "3001345678",
      nombre: "Farmacia Salud Total",
      correo: "salud@email.com",
      sinpe: "89012345",
      id_Tipo: 3,
      cedula_Admin: 456789123
    }
  ];

  private mockProductosPorComercio: { [key: string]: Producto[] } = {
    "3001123456": [
      {
        id: 1,
        nombre: "Hamburguesa Clásica",
        categoria: "Hamburguesas",
        precio: 5500
      },
      {
        id: 2,
        nombre: "Pizza Margarita",
        categoria: "Pizzas",
        precio: 8900
      },
      {
        id: 3,
        nombre: "Ensalada César",
        categoria: "Ensaladas",
        precio: 4500
      }
    ],
    "3001789012": [
      {
        id: 4,
        nombre: "Leche 1L",
        categoria: "Lácteos",
        precio: 1200
      },
      {
        id: 5,
        nombre: "Pan Integral",
        categoria: "Panadería",
        precio: 1500
      },
      {
        id: 6,
        nombre: "Manzanas (kg)",
        categoria: "Frutas",
        precio: 2200
      }
    ],
    "3001345678": [
      {
        id: 7,
        nombre: "Paracetamol",
        categoria: "Medicamentos",
        precio: 2500
      },
      {
        id: 8,
        nombre: "Vitamina C",
        categoria: "Vitaminas",
        precio: 5000
      },
      {
        id: 9,
        nombre: "Alcohol en Gel",
        categoria: "Higiene",
        precio: 1800
      }
    ]
  };

  private mockDirecciones: { [key: string]: DireccionComercio } = {
    "3001123456": {
      id_Comercio: "3001123456",
      provincia: "San José",
      canton: "Central",
      distrito: "Catedral"
    },
    "3001789012": {
      id_Comercio: "3001789012",
      provincia: "San José",
      canton: "Escazú",
      distrito: "San Rafael"
    },
    "3001345678": {
      id_Comercio: "3001345678",
      provincia: "San José",
      canton: "Montes de Oca",
      distrito: "San Pedro"
    }
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.filtroForm = this.fb.group({
      categoria: [''],
      precioMinimo: [''],
      precioMaximo: ['']
    });
  }

  ngOnInit(): void {
    this.cargarComerciosRegion();
    this.recuperarCarrito();
  }

  // Métodos de API
  private async cargarComerciosAPI(): Promise<ComercioAfiliado[]> {
    try {
      let response = await this.http.get<ComercioAfiliado[]>(
        `${this.apiUrl}ComercioAfiliado`
      ).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error al cargar comercios desde API:', error);
      return [];
    }
  }

  private async cargarProductosComercioAPI(cedulaJuridica: string): Promise<Producto[]> {
    try {
      let response = await this.http.get<Producto[]>(
        `${this.apiUrl}ProductoComercio/${cedulaJuridica}`
      ).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error al cargar productos desde API:', error);
      return [];
    }
  }

  private async cargarDireccionComercioAPI(cedulaJuridica: string): Promise<DireccionComercio | null> {
    try {
      let response = await this.http.get<DireccionComercio>(
        `${this.apiUrl}DireccionComercio/${cedulaJuridica}`
      ).toPromise();
      return response || null;
    } catch (error) {
      console.error('Error al cargar dirección desde API:', error);
      return null;
    }
  }

  // Métodos para cargar datos (combinando API y mock)
  private async cargarComerciosRegion(): Promise<void> {
    this.cargandoComercios = true;
    try {
      if (this.usarDatosPrueba) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.comercios = this.mockComercios;
      } else {
        this.comercios = await this.cargarComerciosAPI();
      }
    } catch (error) {
      console.error('Error al cargar comercios:', error);
      this.mostrarError('Error al cargar los comercios');
      // Cargar datos de prueba como fallback
      this.comercios = this.mockComercios;
    } finally {
      this.cargandoComercios = false;
    }
  }

  private async cargarProductosComercio(cedulaJuridica: string): Promise<void> {
    this.cargandoProductos = true;
    try {
      if (this.usarDatosPrueba) {
        await new Promise(resolve => setTimeout(resolve, 800));
        this.productosComercio = this.mockProductosPorComercio[cedulaJuridica] || [];
      } else {
        this.productosComercio = await this.cargarProductosComercioAPI(cedulaJuridica);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.mostrarError('Error al cargar los productos');
      // Cargar datos de prueba como fallback
      this.productosComercio = this.mockProductosPorComercio[cedulaJuridica] || [];
    } finally {
      this.cargandoProductos = false;
    }
  }

  private async cargarDireccionComercio(cedulaJuridica: string): Promise<void> {
    try {
      if (this.usarDatosPrueba) {
        this.direccionComercio = this.mockDirecciones[cedulaJuridica] || null;
      } else {
        this.direccionComercio = await this.cargarDireccionComercioAPI(cedulaJuridica);
      }
    } catch (error) {
      console.error('Error al cargar dirección:', error);
      // Usar dirección mock como fallback
      this.direccionComercio = this.mockDirecciones[cedulaJuridica] || null;
    }
  }

  // Métodos de interacción
  seleccionarComercio(comercio: ComercioAfiliado): void {
    if (this.comercioSeleccionado?.cedula_Juridica !== comercio.cedula_Juridica) {
      this.comercioSeleccionado = comercio;
      this.cargarProductosComercio(comercio.cedula_Juridica);
      this.cargarDireccionComercio(comercio.cedula_Juridica);

      if (this.productosCarrito.length > 0) {
        this.confirmarCambioComercio();
      }
    }
  }

  private confirmarCambioComercio(): void {
    Swal.fire({
      title: '¿Cambiar de comercio?',
      text: 'Si cambias de comercio, perderás los productos en tu carrito actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, mantener carrito'
    }).then((result) => {
      if (result.isConfirmed) {
        this.limpiarCarrito();
      } else {
        this.comercioSeleccionado = null;
      }
    });
  }

  // Métodos del carrito
  agregarAlCarrito(producto: Producto): void {
    let productoEnCarrito = this.productosCarrito.find(
      item => item.producto.id === producto.id
    );

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.productosCarrito.push({ producto, cantidad: 1 });
    }

    this.guardarCarrito();

    Swal.fire({
      title: '¡Producto agregado!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  eliminarDelCarrito(productoId: number): void {
    this.productosCarrito = this.productosCarrito.filter(
      item => item.producto.id !== productoId
    );
    this.guardarCarrito();
  }

  actualizarCantidad(productoId: number, cambio: number): void {
    let productoEnCarrito = this.productosCarrito.find(
      item => item.producto.id === productoId
    );

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += cambio;

      if (productoEnCarrito.cantidad <= 0) {
        this.eliminarDelCarrito(productoId);
      } else {
        this.guardarCarrito();
      }
    }
  }

  obtenerTotal(): number {
    return this.productosCarrito.reduce((total, item) =>
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  limpiarCarrito(): void {
    this.productosCarrito = [];
    this.guardarCarrito();
  }

  // Métodos de persistencia del carrito
  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify({
      comercioId: this.comercioSeleccionado?.cedula_Juridica,
      productos: this.productosCarrito
    }));
  }

  private recuperarCarrito(): void {
    let carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      let carrito = JSON.parse(carritoGuardado);
      if (carrito.comercioId === this.comercioSeleccionado?.cedula_Juridica) {
        this.productosCarrito = carrito.productos;
      }
    }
  }

  // Métodos helper
  private mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  getTipoComercio(id: number): string {
    let tipos = {
      1: 'Restaurante',
      2: 'Supermercado',
      3: 'Farmacia',
      4: 'Dulcería'
    };
    return tipos[id as keyof typeof tipos] || 'Desconocido';
  }

  // Métodos para filtros
  filtrarProductos(): Producto[] {
    let productosFiltrados = [...this.productosComercio];
    let filtros = this.filtroForm.value;

    if (this.busquedaProducto) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().includes(this.busquedaProducto.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(this.busquedaProducto.toLowerCase())
      );
    }

    if (filtros.categoria) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.categoria === filtros.categoria
      );
    }

    if (filtros.precioMinimo) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio >= filtros.precioMinimo
      );
    }

    if (filtros.precioMaximo) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio <= filtros.precioMaximo
      );
    }

    return productosFiltrados;
  }

  buscarProductos(evento: Event): void {
    let busqueda = (evento.target as HTMLInputElement).value;
    this.busquedaProducto = busqueda;
  }

  toggleModoData(): void {
    this.usarDatosPrueba = !this.usarDatosPrueba;
    this.cargarComerciosRegion();
    if (this.comercioSeleccionado) {
      this.cargarProductosComercio(this.comercioSeleccionado.cedula_Juridica);
      this.cargarDireccionComercio(this.comercioSeleccionado.cedula_Juridica);
    }


      Swal.fire({
        title: 'Modo de datos cambiado',
        text: `Ahora usando ${this.usarDatosPrueba ? 'datos de prueba' : 'datos de la API'}`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    }

    obtenerCategoriasUnicas(): string[] {
      return Array.from(new Set(this.productosComercio.map(p => p.categoria)));
    }

    verificarDisponibilidadAPI(): Promise<boolean> {
      return new Promise((resolve) => {
        this.http.get(`${this.apiUrl}health-check`).subscribe({
          next: () => resolve(true),
          error: () => resolve(false)
        });
      });
    }

    async inicializarModoData(): Promise<void> {
      let apiDisponible = await this.verificarDisponibilidadAPI();
      this.usarDatosPrueba = !apiDisponible;

      if (!apiDisponible) {
        console.log('API no disponible, usando datos de prueba');
      }
    }

    ngOnDestroy(): void {
      // Limpieza si es necesaria
      this.productosCarrito = [];
      localStorage.removeItem('carrito');
    }
  }
