import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css']
})
export class CoffeeSearchComponent {
// Loading the Google Maps JS API
  apiLoaded: Observable<boolean>;
  //MY_API_KEY = environment.apiKey;

  constructor(httpClient: HttpClient) {
    // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
    // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

// After Loading API
// Maps Stuff Docs -> https://github.com/angular/components/tree/main/src/google-maps
// Variables
  lat = 24;
  lng = 12;
  display = false;
  center: google.maps.LatLngLiteral = {lat: this.lat, lng: this.lng};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [this.center];
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow; // Don't really understand this

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

  // Display map and geolocation
  displayCurLocation() {
    // Make sure to get approx cur loc
    this.getCurLocation().then(() => {
      // Update map
      this.center = {lat: this.lat, lng: this.lng};
      this.markerPositions = [this.center];
      this.zoom = 10;
      this.display = true;
      console.log(`${this.lat}, ${this.lng}`);
    });
  }
  
}
