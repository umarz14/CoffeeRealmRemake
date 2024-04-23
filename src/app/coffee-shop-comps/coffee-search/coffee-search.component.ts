import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, async } from 'rxjs';




import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';
import { ShopLocation } from '../../models/shop-location.model';
import { ShopsService } from '../../services/shops/shops.service';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { GooglePlacesApiService } from '../../services/places-api/google-places-api.service';

import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css'],
  standalone: true,
  imports: [GoogleMap]
})
export class CoffeeSearchComponent{

  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  display!: google.maps.LatLngLiteral;

moveMap(event: google.maps.MapMouseEvent) {
  if (event.latLng) {
    this.center = event.latLng.toJSON();
  }
}

move(event: google.maps.MapMouseEvent) {
  if (event.latLng) {
    this.display = event.latLng.toJSON();
  }
}
 
} // End of CoffeeSearchComponent

