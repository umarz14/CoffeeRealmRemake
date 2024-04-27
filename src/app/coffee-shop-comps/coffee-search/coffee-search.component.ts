import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, async } from 'rxjs';



import { environment } from 'src/environments/environment';
import { ShopLocation } from '../../models/shop-location.model';
import { ShopsService } from '../../services/shops/shops.service';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { GooglePlacesApiService } from '../../services/places-api/google-places-api.service';
import { RouterTestingHarness } from '@angular/router/testing';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css'],
})
export class CoffeeSearchComponent implements OnInit {

  // This will allows us to display the list once the api has been loaded
  display: boolean = false;

  // This is the list of coffee shops that will be displayed
  shopLocationList: ShopLocation[] = [];

  // These are other variables that we will need
  gmap!: google.maps.Map;
  curUserLoc!: google.maps.LatLngLiteral;

  // This is just a test location delete later
  testlocation = new google.maps.LatLng(33.1824761, -117.2558425);


  constructor(private googleMapsService: GoogleMapsJsApiService,)  {}

  async ngOnInit() {
    try{
      await this.initMap();
      if (this.curUserLoc) {
        await this.googleMapsService.initService(this.gmap);
        this.shopLocationList = await this.googleMapsService.FindCoffeeShopsNearby();
        this.display = true;
      }
    } catch (err) {
      console.log(err);
    }
  }

  // This is the function that will initilize a google map
  // we will pass this to out google maps js service
  // im not passing the map to the places service because
  // it takes an html Element and it doesnt seem like a good idea
  async initMap() {
    try {
      this.curUserLoc = await this.googleMapsService.getUserCurLocation();
      this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: this.curUserLoc,
        zoom: 14,
      });
    } catch (err) {
      console.log(err);
    }
  } // End of initMap()

 

} // End of CoffeeSearchComponent