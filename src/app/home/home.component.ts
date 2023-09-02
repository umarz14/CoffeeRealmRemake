import { Component } from '@angular/core';
import { ShopLocationComponent } from '../shop-location/shop-location.component';
import { ShopLocation } from '../shop-location';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  shopLocationList: ShopLocation[] = [
      {
        placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
        name: "Shop 1",
        latitude: 32.7157,
        longitude: -117.1611,
        photo: "https://picsum.photos/id/28/200"
      },
      {
        placeId: "ChIJrTLr-GyuEmsRBfy61i59si0",
        name: "Shop 2",
        latitude: 32.9595,
        longitude: -117.2653,
        photo: "https://picsum.photos/id/29/200"
      },
      {
        placeId: "ChIJLfySpTOuEmsRsc_JfJtljdc",
        name: "Shop 3",
        latitude: 33.1581,
        longitude: -117.3506,
        photo: "https://picsum.photos/id/17/200"
      },
      {
        placeId: "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",
        name: "Shop 4",
        latitude: 32.6400,
        longitude: -117.0842,
        photo: "https://picsum.photos/id/16/200"
      },
      {
        placeId: "ChIJM1mOVTSYEmsR7Ds1qJv1ajc",
        name: "Shop 5",
        latitude: 33.1959,
        longitude: -117.3795,
        photo: "https://picsum.photos/id/15/200"
      },
      {
        placeId: "ChIJiy6YTjKuEmsRkHZAbW7qABM",
        name: "Shop 6",
        latitude: 32.8328,
        longitude: -117.2713,
        photo: "https://picsum.photos/id/14/200"
      },
      {
        placeId: "ChIJ_5-P0TiuEmsRHrcutjOv_6Y",
        name: "Shop 7",
        latitude: 32.9628,
        longitude: -117.0359,
        photo: "https://picsum.photos/id/13/200"
      },
      {
        placeId: "ChIJwYy_BjKuEmsR0y4O5T2O2Zk",
        name: "Shop 8",
        latitude: 32.5437,
        longitude: -117.0300,
        photo: "https://picsum.photos/id/12/200"
      },
      {
        placeId: "ChIJq6qq6jauEmsRJAf7FjrKnXI",
        name:"Shop9",
         latitude :33.0169 ,
         longitude:-116.8460 ,
         photo:"https://picsum.photos/id/11/200"
        
    },
    {
    placeId:"ChIJLQcbdLGvEmsRuMxvFyNRfbk" ,
    name:"Shop10" ,
    latitude :32.9787 ,
    longitude:-117.0836 ,
    photo:"https://picsum.photos/id/10/200"
    
    }
  ];

}
