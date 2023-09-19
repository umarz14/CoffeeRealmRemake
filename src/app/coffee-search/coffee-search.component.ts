import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';
import { ShopLocation } from '../shop-location';
import { ShopsService } from '../shops.service';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css']
})
export class CoffeeSearchComponent {
// Loading the Google Maps JS API
  apiLoaded: Observable<boolean>;
  //MY_API_KEY = environment.apiKey;
  shopLocationList: ShopLocation[] = [];
  shopService: ShopsService = inject(ShopsService);

  constructor(private httpClient: HttpClient) {

    // Non Google Stuff this might be a placeholde might switch to another component later
    this.shopLocationList = this.shopService.getAllShopLocations();
    
    // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
    // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

// After Loading API
// Maps Stuff Docs -> https://github.com/angular/components/tree/main/src/google-maps
// Variables
  gmap!: google.maps.Map;
  service!: google.maps.places.PlacesService; 

  display = false;

  lat = 24;
  lng = 12;
  
  myCenter: google.maps.LatLngLiteral = {lat: this.lat, lng: this.lng};
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [this.myCenter];
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow; // Don't really understand this

  // Init Map
  async initMap() {
    //const sydney = { lat: -33.867, lng: 151.195 };
    await this.getCurLocation();
    console.log(this.myCenter);
  
    this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.myCenter,
      zoom: 14,
    });

    const request = {
      query: 'coffee shop',
      radius: .5,
      location: this.myCenter,
    };

    this.service = new google.maps.places.PlacesService(this.gmap);
    this.service.textSearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          console.log(results);
          console.log(results.length);
        }
      }
    );

  
  }

  // When click on marker open window
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  
  // Get location using geolocation api
  getCurLocation() {
    return new Promise<void>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.lat = pos.coords.latitude;
            this.lng = pos.coords.longitude;
            this.myCenter = {lat: this.lat, lng: this.lng};
            resolve();
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
  }


  test () {
    this.getCurLocation().then(() => {
      console.log(this.myCenter);
    }); 
  }

  // Display map and geolocation
  displayCurLocation() {
    // Make sure to get approx cur loc
    this.getCurLocation().then(() => {
      // Update map
      //this.center = {lat: this.lat, lng: this.lng};
      this.markerPositions = [this.myCenter];
      this.zoom = 15;
      this.display = true;
      console.log(`${this.lat}, ${this.lng}`);
    });
  }

  

  
}
