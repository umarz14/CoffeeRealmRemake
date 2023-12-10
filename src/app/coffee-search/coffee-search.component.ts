import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';


import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';
import { ShopLocation } from '../shop-location';
import { ShopsService } from '../services/shops/shops.service';

import { GoogleMapsJsApiService } from '../services/google-maps-js-api/google-maps-js-api.service';
import { GooglePlacesApiService } from '../services/places-api/google-places-api.service';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css']
})
export class CoffeeSearchComponent implements OnInit{

  display: boolean = false;

  shopLocationList: ShopLocation[] = [];
  shopService: ShopsService = inject(ShopsService);

  gmap!: google.maps.Map;
  myCenter!: google.maps.LatLngLiteral;

  private apiLoadedSubscription!: Subscription;

  constructor(private googleMapsJsApiService: GoogleMapsJsApiService, private googlePlacesApiService: GooglePlacesApiService ) {}

  async ngOnInit() {

    this.apiLoadedSubscription = this.googleMapsJsApiService.loadGoogleMapsJsApi().subscribe(
      async (apiLoaded) => {
        if(apiLoaded) {
          console.log('apiLoaded');
          // If the api is loaded init the map
          try{
            await this.initMap();
          }
          catch(err) {
            console.log(err);
          }
          // Init the places service
          this.googlePlacesApiService.initPlacesService(this.gmap);
          // Get the shops nearby
          try{
            this.shopLocationList = await this.googlePlacesApiService.getShopsNearby(this.myCenter);
          }
          catch(err) {
            console.log('Failed to get shops nearby');
            console.log(err);
          }
          if(this.shopLocationList.length > 0) {
            this.display = true;
          }
        } else {
          console.error('Failed to load google maps js api');
        }
      }
    );
    
  } // End of ngOnInit()

  ngOnDestroy() {
    this.apiLoadedSubscription.unsubscribe();
  }

  // This is the function that will initilize the map
  // we will then me able to pass gmap to the google maps places service
  // to get coffee shops near the user
  async initMap() {
    try {
      await this.getUserCurLocation();
    } catch (err) {
      console.log(err);
    }
    this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.myCenter,
      zoom: 14,
    });
  } // End of initMap()

  // This function will get the users current location which will then be
  // used to intilize the maps center which is needed in init map
  getUserCurLocation() {
    return new Promise<void>((resolve, reject) => {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.myCenter = {lat: pos.coords.latitude, lng: pos.coords.longitude};
            console.log(this.myCenter);
            resolve(); // delete this late in production
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        alert('Please Enable Location');
        reject();
      }
    });
  } // End of getUserCurLocation()

 
} // End of CoffeeSearchComponent
