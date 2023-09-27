import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ShopLocation } from '../../shop-location';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {


  constructor(private httpClient: HttpClient) {

  } // End of constructor

  // async agetAllShopLocations() : Promise<ShopLocation[]>{
  //   return await getN();
  // }

  getShopLocationId(id: string) : ShopLocation | undefined {
    //return this.shopLocationList.find(shopLocation => shopLocation.placeId === id);
    return undefined;
  }
}
