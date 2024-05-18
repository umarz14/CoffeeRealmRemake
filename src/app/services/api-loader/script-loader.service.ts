import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  constructor() { }

  addGoogleMapsApi() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.MY_GOOGLE_MAPS_JS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}
