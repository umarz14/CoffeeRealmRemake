import { Injectable } from '@angular/core';
import { ShopLocation } from '../../shop-location';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesApiService {
 
  private placesService!: google.maps.places.PlacesService;

  constructor() {}

  // This allows us to start making requests to the places api
  // I had to inilize in this function because services can not
  // manipulate html objects 
  initPlacesService(ps: google.maps.Map) {
    this.placesService = new google.maps.places.PlacesService(ps);
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

  }

}
