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
    //this.shopLocationList = this.shopService.getAllShopLocations();
    
    // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
    // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
    //this.shopLocationList = await this.getShopsNearby2();
  } // End of constructor

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

  // Init Map this is my function that I used to test the google maps api to retrieve coffee shops json
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
  } // End of initMap()

  async getShopsNearby2() {

    // This gets the current location of the user
    await this.getCurLocation();
    
    // This creates a new map to pass to the service to get nearby coffee shops
    this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.myCenter,
      zoom: 14,
    });

    // This is the request to get coffee shops
    const request = {
      query: 'coffee shop',
      radius: 1, // This does not really work at least when tested in initmap();
      location: this.myCenter, // This is your center of search for the api call
    };
      
    // This is the service that gets the coffee shops and returns them in a list json
    // I need to figure out what type of call I wanted to make to the service.
    // I believe the textSearch is the best option for now as it returns a list of 
    // coffee shops near the user by default it returns 20 coffee shops
    this.service = new google.maps.places.PlacesService(this.gmap);
      return new Promise((resolve, reject) => {
        this.service.textSearch(request, (results: 
          google.maps.places.PlaceResult[] | null, 
          status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(results);
              console.log(results.length);
              const shopLocationList: ShopLocation[] = results.map(place => ({
                name: place.name || '',
                placeId: place.place_id || '',
                address: place.formatted_address || '',
                location: {lat: place?.geometry?.location?.lat() || 0, lng: place?.geometry?.location?.lng() || 0},
                imageUrl: place.photos && place.photos[0] ? place.photos[0].getUrl() : '',
                iconUrl: place.icon || '',
                phone_number: place.formatted_phone_number || '',
                website: place.website || '',
              }));
              console.log(shopLocationList);
              resolve(shopLocationList);
            } else {
              reject(status);
            }
          }); // End of this.service.textSearch
      }); // End of return new Promise
  
  } // End of getShopNearby()

  // This returns a list of 20 coffee shops near the user in json format
  async getShopsNearby() {

    // This gets the current location of the user
    await this.getCurLocation();
    
    // This creates a new map to pass to the service to get nearby coffee shops
    this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.myCenter,
      zoom: 14,
    });

    // This is the request to get coffee shops
    const request = {
      query: 'coffee shop',
      radius: 1, // This does not really work at least when tested in initmap();
      location: this.myCenter, // This is your center of search for the api call
    };
      
    // This is the service that gets the coffee shops and returns them in a list json
    // I need to figure out what type of call I wanted to make to the service.
    // I believe the textSearch is the best option for now as it returns a list of 
    // coffee shops near the user by default it returns 20 coffee shops
    this.service = new google.maps.places.PlacesService(this.gmap);
      return new Promise((resolve, reject) => {
        this.service.textSearch(request, (results: 
          google.maps.places.PlaceResult[] | null, 
          status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(results);
              console.log(results.length);
              resolve(results);
            } else {
              reject(status);
            }
          }); // End of this.service.textSearch
      }); // End of return new Promise
  
  } // End of getShopNearby()

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

  

  
} // End of CoffeeSearchComponent
