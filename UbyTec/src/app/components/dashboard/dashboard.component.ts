// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AffiliateShopsComponent } from '../affiliate-shops/affiliate-shops.component';
import { PurchaseHistoryComponent } from '../purchase-history/purchase-history.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AffiliateShopsComponent, PurchaseHistoryComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private sharedService: SharedService){

  }
}
