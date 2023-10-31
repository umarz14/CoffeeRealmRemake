import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopsService } from '../services/shops/shops.service';
import { ShopLocation } from '../shop-location';
@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  // template: `
  // <p>shop-details works!</p>
  // `,
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent {
  @Input() shopLocation!: ShopLocation;
}