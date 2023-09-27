import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'environment';
import { ShopLocation } from '../shop-location';
import { ShopsService } from '../services/shops/shops.service';

@Component({
  selector: 'app-coffee-search',
  templateUrl: './coffee-search.component.html',
  styleUrls: ['./coffee-search.component.css']
})
export class CoffeeSearchComponent {

  //MY_API_KEY = environment.apiKey;
  shopLocationList: ShopLocation[] = [];
  shopService: ShopsService = inject(ShopsService);
 
  // This is the variable that is used to check if the google maps api is loaded
  apiLoaded: Observable<boolean>;

  // These are variables used to initialize the google map
  gmap!: google.maps.Map;
  service!: google.maps.places.PlacesService; 
  myCenter!: google.maps.LatLngLiteral;
  // Maps Stuff Docs -> https://github.com/angular/components/tree/main/src/google-maps

  constructor(private httpClient: HttpClient) {
  
    
    // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
    // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

    // This is the call to load the google maps api
    // If you look at the comment above you can see that you can add libraries to the call
    // I added the places library to the call so that I can use the places api

    // So since the constructor is called when the component is created and is used to i
    // initialize variables for the component I am using it to load the google maps api
    // I'm not sure if this is the best way to do this but it works for now

    // I might need to make another call in the constuctor to get the coffee shops near the user
    // but im not 100% sure yet if that is the best way to do **LOOK AT NGONINIT()**

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  } // End of constructor

  async ngOnInit() {
    // Apperatly it is best to call initMap() in ngOnInit() instead of the constructor
    // because the constructor is called when the component is created and ngOnInit() is called
    // after the component is created so its better to load the api first then initilize the map
    try{
      await this.initMap();
    } catch(err) {
      console.log(err);
    }

  } // End of ngOnInit()


  // This is the function that will initilize the map
  // we will then me able to pass gmap to the google maps places service
  // to get coffee shops near the user
  async initMap() {
    try {
      await this.getUserCurLocation();
      console.log(this.myCenter);
      this.gmap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: this.myCenter,
        zoom: 14,
      });
    } catch (err) {
      console.log(err);
    }
  } // End of initMap()

  // This function will get the users current location which will then be
  // used to intilize the maps center which is needed in init map
  getUserCurLocation() {
    return new Promise<void>((resolve, reject) => {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.myCenter = {lat: pos.coords.latitude, lng: pos.coords.longitude};
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
  } // End of getUserCurLocation()





  display = false;

  lat = 24;
  lng = 12;
  
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [this.myCenter];
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow; // Don't really understand this

  // Init Map this is my function that I used to test the google maps api to retrieve coffee shops json
  async initMap1() {
    //const sydney = { lat: -33.867, lng: 151.195 };
    await this.getUserCurLocation();
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
    await this.getUserCurLocation();
    
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
    await this.getUserCurLocation();
    
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
  
  // Display map and geolocation
  displayCurLocation() {
    // Make sure to get approx cur loc
    this.getUserCurLocation().then(() => {
      // Update map
      //this.center = {lat: this.lat, lng: this.lng};
      this.markerPositions = [this.myCenter];
      this.zoom = 15;
      this.display = true;
      console.log(`${this.lat}, ${this.lng}`);
    });
  }

  

  
} // End of CoffeeSearchComponent
