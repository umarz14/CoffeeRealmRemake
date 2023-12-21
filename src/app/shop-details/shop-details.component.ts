import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopsService } from '../services/shops/shops.service';
import { ShopLocation } from '../shop-location';
import { GooglePlacesApiService } from '../services/places-api/google-places-api.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  // template: `
  // <p>shop-details works!</p>
  // ``
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{
  // This adds a refrence to the shop service
  placesService = inject(GooglePlacesApiService);
  // This is to get the specific shop from the shop service
  shopLocation: ShopLocation | undefined; 

  // this is for testing purposes only
  shop: ShopLocation | undefined;
  location!: google.maps.LatLng;

  // This is for the rating system
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
  // This is for the review form
    applyForm = new FormGroup({
      Review: new FormControl(''),
    });
    



  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // This gets the id from the url and then gets the shop from the shop service
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.shopLocation = this.placesService.getShopById(id);
      console.log(this.shopLocation);
      console.log(this.shopLocation?.imageUrl);
      console.log(this.shopLocation?.location);
      this.location = this.shopLocation?.location as unknown as google.maps.LatLng;
    }
  }


  setRating(newRating: number): void {
    this.rating = newRating;
    console.log(this.rating);
    // Additional logic here if needed, like emitting an event or updating a form control
  }
}