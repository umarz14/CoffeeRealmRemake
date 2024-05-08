import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopLocation } from '../../models/shop-location.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { throttleTime, switchMap } from 'rxjs/operators';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{

  //ntest: number = 0;

  // This is for the favorite button
  // this is an observable that is used to throttle the button
  favButtonClick = new Subject<void>();
  

  coffeeShopId!: string;
  isFavorite!: boolean;
  
  private paramsSubscription!: Subscription;
  private curUserSubscription!: Subscription;

  private curUserId!: string;

  // This is to get the specific shop from the shop service
  shopLocation: ShopLocation | undefined;
  shopCoords!: google.maps.LatLng;
  curShopMap!: google.maps.Map; 

  // this is for the data-bs-target of the modal
  private modal: any; 
  // View child is weird i dont know how to use it yet
    // it has worked fo my modal 
    // but i havent gotten it to work for the throttle button
  @ViewChild('reviewModal') reviewModal!: ElementRef;


  // This is for the rating system
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
  // This is for the review form
  applyForm = new FormGroup({
    Review: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
  });
    

  constructor(private route: ActivatedRoute, private googleMapsService: GoogleMapsJsApiService, 
    private userService: UserService, private authService: AuthService) {
  }

  async ngOnInit() {
    // This gets the id from the url and then gets the shop from the shop service
    this.paramsSubscription = this.route.params.subscribe(params =>{
      this.coffeeShopId = params['id'];
      console.log('coffee shop deatails of: ' + this.coffeeShopId)
    });
    // This gets the current user id
    this.curUserSubscription = this.authService.currentUser.subscribe(user => {
      this.curUserId = user?.uid || 'no user found';
    });

    // I'm not a fan of this but it works
      // this is for the throttle button
      // trottle time is 1 second
      // this means that no matter how many times the button is clicked
      // the function will only be called once every 1 second
      // this is to prevent spamming the server
    this.favButtonClick.pipe(
      throttleTime(1000), // 1 second
      switchMap(() => this.coffeeShopIsAFavorite())
    ).subscribe();

    // This gets the Favorite Coffee Shops List of the current user 
      // we use this to have the favorite button change color
    if(this.curUserId && this.coffeeShopId) {
      this.isFavorite = await this.userService.isCoffeeShopAFavorite(this.curUserId, this.coffeeShopId);
      console.log('isFavorite: ', this.isFavorite);
    }

    // This gets the gets the details of Coffee Shop from the shop service
    if (this.coffeeShopId) {
      this.shopLocation = this.googleMapsService.getCoffeeShopById(this.coffeeShopId);
      if (this.shopLocation) {
        if (this.shopLocation.lat && this.shopLocation.lng) {
          this.shopCoords = new google.maps.LatLng(this.shopLocation.lat, this.shopLocation.lng);
        }
      }
    }
    
  } // End of ngOnInit

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    } else if (this.curUserSubscription) {
      this.curUserSubscription.unsubscribe();
    }
  }

  async coffeeShopIsAFavorite() {
    // first we check if the user has this coffee shop as a favorite
    if(this.isFavorite){
      // if it is a favorite we remove it
      await this.userService.removeFavoriteCoffeeShopFromProfile(this.curUserId, this.coffeeShopId);
      this.isFavorite = false;
    } else {
      // if it is not a favorite we add it
      await this.userService.addFavoriteCoffeeShopToProfile(this.curUserId, this.coffeeShopId);
      this.isFavorite = true;
    }
  }


  setRating(newRating: number): void {
    this.rating = newRating;
    console.log(this.rating);
    // Additional logic here if needed, like emitting an event or updating a form control
  } // End of setRating

  // This is to reset the star rating value on the form
  resetRating() {
    this.rating = 0;
  }

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