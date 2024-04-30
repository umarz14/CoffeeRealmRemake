import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
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
   // This is pretty much a struct 
   @Input() shopLocation!: ShopLocation;

  // This will allows us to display the list once the api has been loaded
  display: boolean = false;

  // This is the list of coffee shops that will be displayed
  shopLocationList: ShopLocation[] = [];

  // These are other variables that we will need
  gmap!: google.maps.Map;
  curUserLoc!: google.maps.LatLngLiteral;


  constructor(private googleMapsService: GoogleMapsJsApiService,)  {}

  async ngOnInit() {
    try{
      // This will initilize the google maps service just in case it has not been initilized
      await this.googleMapsService.initService();
      await this.initMap();
      if(this.gmap) {
        this.googleMapsService.setServiceMap(this.gmap);
        this.shopLocationList = await this.googleMapsService.FindCoffeeShopsNearby();
        if(this.shopLocationList.length > 0) {
          this.display = true;
        }
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
    try{
      this.curUserLoc = await this.googleMapsService.getUserCurLocation();
      if(this.curUserLoc) {
        this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: this.curUserLoc,
          zoom: 14,
        });
      }
      else {
        console.log("Error: Could not get user location");
      }
    } catch (err) {
      console.log(err);
    }
  } // End of initMap()

 

} // End of CoffeeSearchComponent