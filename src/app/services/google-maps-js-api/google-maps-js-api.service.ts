import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsJsApiService {

  //apiLoaded: Observable<boolean>;
  constructor(private httpClient: HttpClient) {}

  // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
  // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

  // This is the call to load the google maps api
  // If you look at the comment above you can see that you can add libraries to the call    
  // I added the places library to the call so that I can use the places api
  loadGoogleMapsJsApi(): Observable<any> {
    return this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}&libraries=places`, 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
