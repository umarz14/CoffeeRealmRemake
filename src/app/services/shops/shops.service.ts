import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';
import { ShopLocation } from '../../models/shop-location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  // I might write this service later on to seperate my shop backend functions from the rest of the app
    // for example add favorite shop, note sure if my code needs to be that modular yet. 
    // my project is already growing and keeping track of what functions are doing what where
    // is already becoming a bit of a challenge. But for now this will stay here and be deleted later if not needed.
}
