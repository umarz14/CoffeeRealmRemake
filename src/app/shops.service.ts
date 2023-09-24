import { Injectable } from '@angular/core';
import { ShopLocation } from './shop-location';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor() { }

  // async agetAllShopLocations() : Promise<ShopLocation[]>{
  //   return await ;
  // }

  getShopLocationId(id: string) : ShopLocation | undefined {
    //return this.shopLocationList.find(shopLocation => shopLocation.placeId === id);
    return undefined;
  }
}
