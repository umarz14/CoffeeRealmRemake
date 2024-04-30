import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopLocation } from '../../models/shop-location.model';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Firestore,collection, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import {GoogleMap, MapMarker} from '@angular/google-maps';
import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';


@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  // template: `
  // <p>shop-details works!</p>
  // ``
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{

  coffeeShopId!: string;
  
  private paramsSubscription!: Subscription;

  // This is to get the specific shop from the shop service
  shopLocation: ShopLocation | undefined;
  shopCoords!: google.maps.LatLng;
  curShopMap!: google.maps.Map; 

  //this is firestore test
  firestore = inject(Firestore);
  items$: Observable<any[]>;

  private modal: any; 

  @ViewChild('reviewModal') reviewModal!: ElementRef;

  // This is for the rating system
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
  // This is for the review form
  applyForm = new FormGroup({
    Review: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
  });
    



  constructor(private route: ActivatedRoute, private googleMapsService: GoogleMapsJsApiService) {
    const aCollection = collection(this.firestore, 'items')
    this.items$ = collectionData(aCollection);
  }

  async ngOnInit() {
    // This gets the id from the url and then gets the shop from the shop service
    this.paramsSubscription = this.route.params.subscribe(params =>{
      this.coffeeShopId = params['id'];
      console.log('coffee shop deatails of: ' + this.coffeeShopId)
    });
    if (this.coffeeShopId) {
      this.shopLocation = this.googleMapsService.getCoffeeShopById(this.coffeeShopId);
      if (this.shopLocation) {
        if (this.shopLocation.lat && this.shopLocation.lng) {
          this.shopCoords = new google.maps.LatLng(this.shopLocation.lat, this.shopLocation.lng);
        }
      }
      // this.curShopMap = new google.maps.Map(document.getElementById('shopMap') as HTMLElement, { center: this.shopCoords, zoom: 15 });
      // const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      // const marker = new AdvancedMarkerElement({
      //   position: this.shopCoords,
      //   map: this.curShopMap,
      //   title: this.shopLocation?.name,
      // });
    }
    
  } // End of ngOnInit

  // Since the modal is not created until the click of review 
  // i believe we have to use this lifecycle in order to access it
  // otherwise it will be null
  // ngAfterViewInit() {
  //   this.modal = new Modal(this.reviewModal.nativeElement, {});
  // }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
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