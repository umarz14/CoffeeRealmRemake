import { Injectable } from '@angular/core';
import { ShopLocation } from 'src/app/models/shop-location.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsJsApiService {

  //Places API(New) - https://developers.google.com/maps/documentation/places/web-service/reference/rest
  
  // These are our intilized variables
    // This is the maps important for the google maps api

  private gmap!: google.maps.Map;
    // This is a the interface that allows us to make api calls with the google places api
      // I set it to any because it library from google and their is no general type for it atm 
      // https://developers.google.com/maps/documentation/javascript/reference/top-level
  private googlePlaces!: any;
    // This var is to store all our shop locations so that we
      // are not constatly making api calls
  private CoffeeShopList: ShopLocation[] = [];

  constructor() {} 

  // This function will import the google maps and google places library
    // if they are not already imported
    // the plan is for this to be called at the start of the web app aka home page
  async initService() {
    if (!google.maps || !google.maps.Map) {
      console.log('Importing Google Maps Library');
      try {
        await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      } catch (err) {
        console.log(err);
      }
      //await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    }
  }

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

  // This is the function that will initilize all the variables
    // that we need to start making api calls
  async setServiceMap(googleMap: google.maps.Map) {
    this.gmap = googleMap;
  }

  // This function will get the coffee shops in a 5 mile radius based on the center of the map
    // which is the users current location by default
    // the text search call of th places api returns 20 coffee shops 
    // Results are returned as a list of Place objects, from which you can get place details.
    // (https://developers.google.com/maps/documentation/javascript/reference/place)
    // we then convert this list of place objects to a list of ShopLocation objects
  async FindCoffeeShopsNearby() {
    if(this.CoffeeShopList.length !== 0) {
      return this.CoffeeShopList;
    } if (this.gmap.getCenter() === undefined) {
      return [];
    } else {
      // These are the parameters for the request
      const request = {
        textQuery: 'coffee shops',
        fields: ['id','displayName', 'location', 'formattedAddress', 'photos'],
        locationBias: new google.maps.Circle({ center: this.gmap.getCenter(), radius: 8046.72 }), // 5 miles in meters
        language: 'en-US',
        maxResultCount: 20,
        region: 'us',
      };
      try {
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const { places } = await Place.searchByText(request);
        if (places) {
          console.log(places);
          this.CoffeeShopList = places.map((place: google.maps.places.Place) => {
            return {
              uid: place.id,
              name: place.displayName,
              address: place.formattedAddress,
              lat: place.location?.toJSON().lat || 0,
              lng: place.location?.toJSON().lng || 0,
              imageUrl: place.photos && place.photos[0] ? place.photos[0].getURI({maxHeight:4800, maxWidth:4800}) : 'assets/img/coffe-cups.jpg',
              phone_number: place.nationalPhoneNumber || '',
              website: place.websiteURI || '',
              // Add other fields as needed
            } as ShopLocation;
          });
          return this.CoffeeShopList;
        }
      } catch (err) {
        console.log('Error: ' + err);
      } // end of try/catch
      return [];
    } // end of if/else
  } // End of FindCoffeeShopsNearby()

  // This function return a shopLocation based on the placeId
  getCoffeeShopById(placeId: string): ShopLocation {
    return this.CoffeeShopList.find(shop => shop.uid === placeId) || {} as ShopLocation;
  }

  async getCoffeeShopGoogleDetailsById(placeId: string): Promise<ShopLocation> {
    const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    const place = new Place({ id: placeId, requestedLanguage: 'en-US' });
    await place.fetchFields({
      fields: ['displayName', 'location', 'formattedAddress', 'photos', 'nationalPhoneNumber', 'websiteURI']
    });
    if (place) {
      return {
        uid: place.id,
        name: place.displayName,
        address: place.formattedAddress,
        lat: place.location?.toJSON().lat || 0,
        lng: place.location?.toJSON().lng || 0,
        imageUrl: place.photos && place.photos[0] ? place.photos[0].getURI({maxHeight:4800, maxWidth:4800}) : 'assets/img/coffe-cups.jpg',
        phone_number: place.nationalPhoneNumber || '',
        website: place.websiteURI || '',
      } as ShopLocation;
    }
    return {} as ShopLocation;
  }

} 

