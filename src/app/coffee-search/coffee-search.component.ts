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


  // async getShopsNearby2() {

  //   // This gets the current location of the user
  //   await this.getUserCurLocation();
    
  //   // This creates a new map to pass to the service to get nearby coffee shops
  //   this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
  //     center: this.myCenter,
  //     zoom: 14,
  //   });

  //   // This is the request to get coffee shops
  //   const request = {
  //     query: 'coffee shop',
  //     radius: 1, // This does not really work at least when tested in initmap();
  //     location: this.myCenter, // This is your center of search for the api call
  //   };
      
  //   // This is the service that gets the coffee shops and returns them in a list json
  //   // I need to figure out what type of call I wanted to make to the service.
  //   // I believe the textSearch is the best option for now as it returns a list of 
  //   // coffee shops near the user by default it returns 20 coffee shops
  //   this.service = new google.maps.places.PlacesService(this.gmap);
  //     return new Promise((resolve, reject) => {
  //       this.service.textSearch(request, (results: 
  //         google.maps.places.PlaceResult[] | null, 
  //         status: google.maps.places.PlacesServiceStatus) => {
  //           if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //             console.log(results);
  //             console.log(results.length);
  //             const shopLocationList: ShopLocation[] = results.map(place => ({
  //               name: place.name || '',
  //               placeId: place.place_id || '',
  //               address: place.formatted_address || '',
  //               location: {lat: place?.geometry?.location?.lat() || 0, lng: place?.geometry?.location?.lng() || 0},
  //               imageUrl: place.photos && place.photos[0] ? place.photos[0].getUrl() : '',
  //               iconUrl: place.icon || '',
  //               phone_number: place.formatted_phone_number || '',
  //               website: place.website || '',
  //             }));
  //             console.log(shopLocationList);
  //             resolve(shopLocationList);
  //           } else {
  //             reject(status);
  //           }
  //         }); // End of this.service.textSearch
  //     }); // End of return new Promise
  
  // } // End of getShopNearby()

 
} // End of CoffeeSearchComponent
