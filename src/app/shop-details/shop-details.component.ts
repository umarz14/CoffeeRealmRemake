import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopsService } from '../services/shops/shops.service';
import { ShopLocation } from '../shop-location.modal';
import { GooglePlacesApiService } from '../services/places-api/google-places-api.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';

import { Firestore,collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  // template: `
  // <p>shop-details works!</p>
  // ``
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{
  
  //this is firestore test
  firestore = inject(Firestore);
  items$: Observable<any[]>;

  // This adds a refrence to the shop service
  placesService = inject(GooglePlacesApiService);
  // This is to get the specific shop from the shop service
  shopLocation: ShopLocation | undefined; 

  // this is for testing purposes only
  shop: ShopLocation | undefined;
  location!: google.maps.LatLng;

  private modal: any; 

  @ViewChild('reviewModal') reviewModal!: ElementRef;

  // This is for the rating system
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
  // This is for the review form
  applyForm = new FormGroup({
    Review: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
  });
    



  constructor(private route: ActivatedRoute) {
    const aCollection = collection(this.firestore, 'items')
    this.items$ = collectionData(aCollection);
  }

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
  } // End of ngOnInit

  // Since the modal is not created until the click of review 
  // i believe we have to use this lifecycle in order to access it
  // otherwise it will be null
  ngAfterViewInit() {
    this.modal = new Modal(this.reviewModal.nativeElement, {});
  }


  setRating(newRating: number): void {
    this.rating = newRating;
    console.log(this.rating);
    // Additional logic here if needed, like emitting an event or updating a form control
  } // End of setRating


  submitReview() {
    if (this.applyForm.valid && this.rating!=0) {
      const review = this.applyForm.value.Review;
      console.log(review);
      // handle form submission
      this.modal.hide();
      // This manually removes the backdrop of the modal for us
      // it stays when we close it. 
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    } else {
      window.alert('Please fill out the Rating and Review');
    }
  }
}