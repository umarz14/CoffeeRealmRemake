import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
/***** THIS SERVICE WILL BE DEDICATED TO THE SHOPS COLLECTIONS AND SUBCOLLECTIONS IN FIRESTORE *****/
  constructor(private firestore: Firestore) {}

  // This function will get all the add a new shop to the shops collection
    // *NOTE* a coffee shop will not have a document if there are no reviews
  addShop() {
    console.log('Adding a new shop');
  }

  // This function will get a specific shop from the shops collection
  getShop() {
    console.log('Getting a specific shop');
  }

  // This function will get all the publish a review to a specific shop
  publishReview() {
    console.log('Publishing a review');
    // 1. Get the shop document if it does not exist create it
    // 2. If it does exist check that a review has not been published by the user
    // 3. If a review has not been published add the review to the shops reviews subcollection
  }


}
