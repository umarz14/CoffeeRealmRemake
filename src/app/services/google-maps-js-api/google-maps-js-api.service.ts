import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsJsApiService {

  // We created this variable because we want to make sure that we only load the google maps api once
  private apiloaded!: Observable<boolean>;

  // Remeber for sigletonn instances we dont need to unscribe
  // because angular handles that for us

  //apiLoaded: Observable<boolean>;
  constructor(private httpClient: HttpClient) {}

  // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
  // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

  // This is the call to load the google maps api
  // If you look at the comment above you can see that you can add libraries to the call    
  // I added the places library to the call so that I can use the places api
  // loadGoogleMapsJsApi(): Observable<boolean> {
  //   if(this.apiloaded === undefined) {
  //   this.apiloaded = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`, 'callback')
  //     .pipe(
  //       map(() => true),
  //       catchError(() => of(false))
  //     );
  //   }
  //   return this.apiloaded;
  // }

} // End of google maps js api service


