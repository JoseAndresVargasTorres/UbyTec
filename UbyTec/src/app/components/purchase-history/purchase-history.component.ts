// purchase-history.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory: any[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadPurchaseHistory();
  }

  loadPurchaseHistory(): void {
    this.sharedService.getPurchaseHistory().subscribe(data => {
      this.purchaseHistory = data;
    });
  }
}
