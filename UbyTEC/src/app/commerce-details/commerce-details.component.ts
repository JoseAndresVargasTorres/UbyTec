import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commerce-details',
  standalone: true,
  templateUrl: './commerce-details.component.html',
  styleUrls: ['./commerce-details.component.css']
})
export class CommerceDetailsComponent implements OnInit {
  commerceId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el ID del comercio desde la ruta
    this.route.paramMap.subscribe(params => {
      this.commerceId = params.get('id');
      console.log('Commerce ID:', this.commerceId);
      // Aquí podrías realizar una llamada a una API para obtener detalles del comercio
    });
  }
}
