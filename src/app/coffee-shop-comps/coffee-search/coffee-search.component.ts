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
  myCenter!: google.maps.LatLngLiteral;

  testlocation = new google.maps.LatLng(33.1824761, -117.2558425);


  constructor(private googleMapsService: GoogleMapsJsApiService, private googlePlaces: GooglePlacesApiService)  {}

  async ngOnInit() {
    try{
      await this.initMap();
      // This will init the places service
      this.googlePlaces.initPlacesService(this.gmap);
      this.shopLocationList = await this.googlePlaces.findShopsNearby();
      
    } catch (error) {
      console.log(error);
    }

    if(this.shopLocationList.length > 0) {
      this.display = true;
    }
    else {
      console.log('No shops found');
    }
  }

  // This is the function that will initilize the map
  // we will then me able to pass gmap to the google maps places service
  // to get coffee shops near the user
  async initMap() {
    try {
      this.myCenter = await this.getUserCurLocation();
      this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: this.testlocation,
        zoom: 14,
      });
      console.log(this.gmap.getCenter()?.lat);
      console.log(this.gmap.getCenter()?.lng);
    } catch (err) {
      console.log(err);
    }
  } // End of initMap()

  // This function will get the users current location which will then be
  // used to intilize the maps center which is needed in initmap
  async getUserCurLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
      if (navigator.geolocation) {
        const options: PositionOptions = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const location: google.maps.LatLngLiteral = { lat: pos.coords.latitude, lng: pos.coords.longitude };

            console.log("this is users current location: " + location.lat + " " + location.lng);
            resolve(location);
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