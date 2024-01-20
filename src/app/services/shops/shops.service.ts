import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';
import { ShopLocation } from '../../shop-location.modal';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  /*
  protected shopLocationList: ShopLocation[]  = []
  
  constructor(private httpClient: HttpClient) {}

  private placesService!: google.maps.places.PlacesService;

  // This function loads in the google maps api
  loadPlacesService() : Observable<boolean> {
    return this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
    .pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  // This allows us to start making requests to the places api
  // I had to inilize in this function because services can not
  // manipulate html objects 
  initPlacesService(ps: google.maps.places.PlacesService) {
    this.placesService = ps;
  }

  // This is the service that gets the coffee shops and returns them in a list json
  // I need to figure out what type of call I wanted to make to the service.
  // I believe the textSearch is the best option for now as it returns a list of 
  // coffee shops near the user by default it returns 20 coffee shops
  async getShopsNearby(center: google.maps.LatLngLiteral) : Promise<ShopLocation[]>{
    
    // This is the request to get coffee shops
    const request = {
      query: 'coffee shop',
      radius: 1, // This does not really work at least when tested in initmap();
      location: center, // This is your center of search for the api call
    };

    return new Promise((resolve, reject) => {
      this.placesService.textSearch(request, (results: 
        google.maps.places.PlaceResult[] | null, 
        status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            this.shopLocationList = results.map(place => ({
              name: place.name || '',
              placeId: place.place_id || '',
              address: place.formatted_address || '',
              location: {lat: place?.geometry?.location?.lat() || 0, lng: place?.geometry?.location?.lng() || 0},
              imageUrl: place.photos && place.photos[0] ? place.photos[0].getUrl() : '',
              iconUrl: place.icon || '',
              phone_number: place.formatted_phone_number || '',
              website: place.website || '',
            }));
            console.log('shopLocationList');
            console.log(this.shopLocationList);
            resolve(this.shopLocationList);
          } else {
            reject(status);
          }
        }); // End of this.service.textSearch
    }); // End of return new Promise

  
  }

  getShopLocationList() : ShopLocation[] {
    return this.shopLocationList;
  }
  getShopLocationId(id: string) : ShopLocation | undefined {
    return this.shopLocationList.find(shopLocation => shopLocation.placeId === id);
  }
  */
}
