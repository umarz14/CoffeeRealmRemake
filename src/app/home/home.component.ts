import { Component,inject } from '@angular/core';
import { ShopLocationComponent } from '../shop-location/shop-location.component';
import { ShopLocation } from '../shop-location';
import { ShopsService } from '../shops.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  shopLocationList: ShopLocation[] = [];
  shopService: ShopsService = inject(ShopsService);

  constructor() {
    this.shopLocationList = this.shopService.getAllShopLocations();
  }
}
