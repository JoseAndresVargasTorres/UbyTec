import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-affiliate-shops',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './affiliate-shops.component.html',
  styleUrls: ['./affiliate-shops.component.css']
})
export class AffiliateShopsComponent implements OnInit {
  affiliateShops: any[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadAffiliateShops();
  }

  loadAffiliateShops(): void {
    this.sharedService.getAffiliateShops().subscribe(data => {
      this.affiliateShops = data;
    });
  }
}
