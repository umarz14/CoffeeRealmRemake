import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopLocation } from '../../models/shop-location.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { throttleTime, switchMap } from 'rxjs/operators';

import { GoogleMapsJsApiService } from '../../services/google-maps-js-api/google-maps-js-api.service';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShopsService } from 'src/app/services/shops/shops.service';


@Component({
  selector: 'app-shop-details',
   templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit{

  isCollasped = true;

  //ntest: number = 0;

  // This is for the favorite button
  // this is an observable that is used to throttle the button
  favButtonClick = new Subject<void>();
  

  coffeeShopId!: string;
  isFavorite!: boolean;
  
  private paramsSubscription!: Subscription;
  private curUserSubscription!: Subscription;

  curUserId: string = '';

  // This is to get the specific shop from the shop service
  shopLocation!: ShopLocation;
  shopCoords!: google.maps.LatLng;
  curShopMap!: google.maps.Map; 

  // this is for the data-bs-target of the modal
  private modal: any; 
  // View child is weird i dont know how to use it yet
    // it has worked fo my modal 
    // but i havent gotten it to work for the throttle button
  // @ViewChild('reviewModal') reviewModal!: ElementRef;


  // This is for the rating system
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
  // This is for the review form
  applyForm = new FormGroup({
    Review: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
  });
    
  reviews: any[] = [];

  constructor(private route: ActivatedRoute, private googleMapsService: GoogleMapsJsApiService, 
    private userService: UserService, private authService: AuthService, private shopService: ShopsService) {
  }

  async ngOnInit() {
    // This gets the id from the url and then gets the shop from the shop service
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      this.coffeeShopId = params['id'];
      console.log('coffee shop deatails of: ' + this.coffeeShopId)

        if(this.coffeeShopId){
          this.shopLocation = this.googleMapsService.getCoffeeShopById(this.coffeeShopId);
          if (this.shopLocation) {
            if (this.shopLocation.lat && this.shopLocation.lng) {
              this.shopCoords = new google.maps.LatLng(this.shopLocation.lat, this.shopLocation.lng);
            }
            try{
              this.reviews = await this.shopService.getAllReviewsForShop(this.coffeeShopId);
            } catch (error) {
              console.log('Error getting reviews: ');
              console.log(error);
            }
            if (this.reviews) {
              console.log(this.reviews);
            }
          }

          // This gets the current user id
          this.curUserSubscription = this.authService.currentUser.subscribe(async (user) =>  {
            if (user) {
              this.curUserId = user.uid;

              // This is the throttle button for the favorite button
              this.favButtonClick.pipe(
                throttleTime(1000), // 1 second
                switchMap(() => this.coffeeShopIsAFavorite())
              ).subscribe();
              
              // This gets the Favorite Coffee Shops List of the current user 
                // we use this to have the favorite button change color
              this.isFavorite = await this.userService.isCoffeeShopAFavorite(this.curUserId, this.coffeeShopId);
              console.log('isFavorite: ', this.isFavorite);
              }
          });
        }
    });
    
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

  
  async submitReview() {
    if (this.applyForm.valid && this.rating!=0) {
      const review = this.applyForm.value.Review || '';
      const starRating = this.rating;
      await this.shopService.publishReview(this.shopLocation, this.curUserId, "yellow" ,review, starRating);
      this.applyForm.reset();
      this.rating = 0;
      //console.log(review);
      //console.log(this.rating);
      this.applyForm.reset();
      this.rating = 0;
    } else if (this.rating === 0 && this.applyForm.valid) {
      window.alert('Please fill out the Rating');
    } else if (this.rating !== 0 && !this.applyForm.valid) {
      window.alert('Please fill out the Review');
    } else {
      window.alert('Please fill out the Review and Rating');
    }
  }

  // THESE ARE HELPER FUNCTIONS FOR THE REVIEW INTERFACE TO WORK WITH THE HTML
  
  getRewiewRatingArray(rating: number) {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(i);
    }
    return stars;
  }

  formatDate(date: any) {
    return new Date(date).toLocaleDateString();
  }

  toggleCollapse() {
    this.isCollasped = !this.isCollasped;
  }


}