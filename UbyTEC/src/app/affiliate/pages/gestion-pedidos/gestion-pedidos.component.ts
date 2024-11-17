import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/API/api.service';
import { TableService } from '../../../Services/Table/table.service';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [MatTableModule, CommonModule,HeaderAffiliateComponent],
  templateUrl: './gestion-pedidos.component.html',
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent {
  objects: any[] = [];  // Array para almacenar objetos
  displayedColumns: string[] = [];  // Array para almacenar las columnas a mostrar en la tabla
  
  constructor(private table_service: TableService, private router:Router, private api: ApiService){
    const obj = {num_pedido: 10, nombre: "juan", estado:"sin repartidor", monto_total: 20000, id_repartidor: 47}
    this.objects.push(obj);
  }

  ngOnInit(): void {
    
    const columns = ['num_pedido', 'nombre', 'estado', 'monto_total', 'id_repartidor'];  // Definir las columnas a mostrar
    this.table_service.showTable(this.objects, columns);
    this.displayedColumns = this.table_service.displayedColumns;
    /**
    let data = this.api.getData('Pedidos/');
    data.subscribe({
      next: res => {
        this.table_service.showTable(res, columns);  // Mostrar la tabla con los datos y columnas definidos
        this.objects = this.table_service.objects;  // Obtener objetos de la tabla desde el servicio
        this.displayedColumns = this.table_service.displayedColumns;  // Obtener columnas a mostrar desde el servicio},  // Imprimir la respuesta en caso de éxito
      },error: err => {console.error(err) }  // Imprimir el error en caso de fallo
    });
    **/

  }

  onButtonClick(element: any): void {
    //this.api.postData('Asignarepartidos/', `${element["num_pedido"]}`);
  }

}
