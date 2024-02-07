import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, async } from 'rxjs';


import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';
import { ShopLocation } from '../../models/shop-location.model';
import { ShopsService } from '../../services/shops/shops.service';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { GooglePlacesApiService } from '../../services/places-api/google-places-api.service';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css']
})
export class CoffeeSearchComponent implements OnInit {

  // This will allows us to display the list once the api has been loaded
  display: boolean = false;

  // This is the list of coffee shops that will be displayed
  shopLocationList: ShopLocation[] = [];

  // These are other variables that we will need
  gmap!: google.maps.Map;
  myCenter!: google.maps.LatLngLiteral;
  // We only need so that we can unscribe from the subscription
  private apiLoadedSubscription!: Subscription;

  // This allows us to use the services we created
  googleMapsJsApiService: GoogleMapsJsApiService = inject(GoogleMapsJsApiService);
  googlePlacesApiService: GooglePlacesApiService = inject(GooglePlacesApiService);

  constructor() {}

  async ngOnInit() {
    
    // This loads the google maps js api
    // We have to subscribe to the loadGoogleMapsJsApi() function
    // because we are doing an htttp request
    this.apiLoadedSubscription = this.googleMapsJsApiService.loadGoogleMapsJsApi().subscribe(
      async (apiLoaded) => {
        try {
          // This will grab the users current location
          // and set it to myCenter
          await this.initMap(); 
        }
        catch(err) {
          console.log(err);
        }

        // This will init the places service
        this.googlePlacesApiService.initPlacesService(this.gmap);

        // This will get the shops nearby
        try {
          this.shopLocationList = await this.googlePlacesApiService.findShopsNearby();
        }
        catch(err) {
          console.log('Failed to get shops nearby');
          console.log(err);
        }

        if(this.shopLocationList.length > 0) {
          this.display = true;
        }
        else {
          console.log('No shops found');
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
  // used to intilize the maps center which is needed in initmap
  getUserCurLocation() {
    return new Promise<void>((resolve, reject) => {
      if (navigator.geolocation) {
        const options: PositionOptions = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('getUserCurLocation');
            console.log(pos.coords.latitude);
            console.log(pos.coords.latitude + ' ' + pos.coords.longitude);
            this.myCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };

            console.log(this.myCenter);
            resolve(); // delete this later in production
          },
          (err) => {
            reject(err);
          },
          options
        );
      } else {
        alert('Please Enable Location');
        reject();
      }
    });
  } // End of getUserCurLocation()

 
} // End of CoffeeSearchComponent

/* This Is an old vesion for getting the shops
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
            this.shopLocationList = await this.googlePlacesApiService.findShopsNearby(this.myCenter);
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
*/
