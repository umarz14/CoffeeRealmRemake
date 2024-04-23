import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, async } from 'rxjs';



import { environment } from 'environment';
import { ShopLocation } from '../../models/shop-location.model';
import { ShopsService } from '../../services/shops/shops.service';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { GooglePlacesApiService } from '../../services/places-api/google-places-api.service';


@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css'],
})
export class CoffeeSearchComponent{

  gmap!: google.maps.Map;
  myCenter!: google.maps.LatLngLiteral;

  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  display!: google.maps.LatLngLiteral;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center = (event.latLng.toJSON());
    }
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng?.toJSON() ?? {lat: 0, lng: 0};
  }


  // This function will get the users current location which will then be
  // used to intilize the maps center which is needed in initmap
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

            this.myCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };

            console.log("this is users current location: " + this.myCenter.lat + " " + this.myCenter.lng);
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

