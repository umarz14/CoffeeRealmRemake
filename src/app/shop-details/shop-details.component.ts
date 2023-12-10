import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopsService } from '../services/shops/shops.service';
import { ShopLocation } from '../shop-location';
@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  // template: `
  // <p>shop-details works!</p>
  // ``
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{
  // This adds a refrence to the shop service
  shopService = inject(ShopsService);
  // This is to get the specific shop from the shop service
  shopLocation: ShopLocation | undefined; 

  // this is for testing purposes only
  shopLocationList: ShopLocation[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // This gets the id from the url and then gets the shop from the shop service
    const id = this.route.snapshot.paramMap.get('id');
    console.log('checking if data is being passed');
    if (id) {
      this.shopLocation = this.shopService.getShopLocationId(id);
      console.log('are we getting data?');
      console.log(this.shopLocation);
    }

    // This is for testing purposes only
    console.log('checking if service is working');
    this.shopLocationList = this.shopService.getShopLocationList();
    console.log(this.shopLocationList);
  }
}