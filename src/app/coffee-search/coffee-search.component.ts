import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
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
export class CoffeeSearchComponent implements AfterViewInit{

  //MY_API_KEY = environment.apiKey;
  shopLocationList: ShopLocation[] = [];
  shopService: ShopsService = inject(ShopsService);
 
  // This is the variable that is used to check if the google maps api is loaded
  apiLoaded: Observable<boolean>;
  display = false;

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

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  } // End of constructor

  async ngAfterViewInit() {
    // Apperatly it is best to call initMap() in ngOnInit() instead of the constructor
    // because the constructor is called when the component is created and ngOnInit() is called
    // after the component is created so its better to load the api first then initilize the map

    // IGNORE THE COMMENT ABOVE I WAS WRONG
    // I kept it to show my thought process
    // but i guess if i want to init the map after the api is loaded i should use ngAfterViewInit()
    // not 100% sure why but it works
    // if i use ngOnInit() the map is not loaded when i try to init it and i get an error
    try{
      await this.initMap();
    } catch(err) {
      console.log(err);
    }

    this.apiLoaded.subscribe(async apiLoaded => {
      if (apiLoaded) {
        this.service = new google.maps.places.PlacesService(this.gmap);
        this.shopService.initPlacesService(this.service);
        //this.shopLocationList = await this.shopService.getShopsNearby(this.myCenter);
      }
    });

    if(this.shopLocationList.length > 0) {
      this.display = true;
    }
  } // End of ngOnInit()


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

 
} // End of CoffeeSearchComponent
