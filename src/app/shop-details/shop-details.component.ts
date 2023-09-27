import { Component, inject } from '@angular/core';
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
  route: ActivatedRoute = inject(ActivatedRoute);
  shopsService = inject(ShopsService);
  shopLocation: ShopLocation | undefined;

  constructor() {
    const shopLocationId = String(this.route.snapshot.params['placeId']);
    this.shopLocation = this.shopsService.getShopLocationId(shopLocationId);
  }
}
