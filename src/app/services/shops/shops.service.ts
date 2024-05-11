import { Injectable } from '@angular/core';
import { Firestore, collection, doc, query, where, getDocs, getDoc, setDoc, addDoc, updateDoc } from '@angular/fire/firestore';
import { limit } from 'firebase/firestore';
import { ShopLocation } from 'src/app/models/shop-location.model';


@Injectable({
  providedIn: 'root'
})
export class ShopsService {

/***** THIS SERVICE WILL BE DEDICATED TO THE SHOPS COLLECTIONS AND SUBCOLLECTIONS IN FIRESTORE *****/
  ShopCollection = collection(this.firestore, `shops`);  

  constructor(private firestore: Firestore) {}

  // This function will get all the reviews for a specific shop
  async getAllReviewsForShop(shopUid: string) {
    const shopDocRef = doc(this.ShopCollection, shopUid);
    const curShopReviewCollection = collection(shopDocRef, 'reviews');
    const querySnapshot = await getDocs(curShopReviewCollection);
    let reviews: any[] = []; // Explicitly declare the type of 'reviews' as an array of any
    querySnapshot.forEach((doc) => {
      reviews.push(doc.data());
    });
    return reviews;
  } // End of getReviews()
   
  // This function will get all the publish a review to a specific shop
    // 1. Check if there exist a document for the shop
      // Does exist -> step 2
      // Does not exist -> create a new document for the shop then step 2
    // 2. If the document exists, check if the user has already reviewed the shop
      // Has reviewed -> update the review
      // Has not reviewed -> add a new review
  async publishReview(shopLoc: ShopLocation, userUid: string, review: string, rating: number, ) {
    
    let shopDocExists = await this.checkShop(shopLoc.uid);

    if(!shopDocExists) {
      console.log('Shop Doc does not exist');
      await this.addShop(shopLoc);
      console.log('Shop Doc added');
    }

    // This will return the review id if the user has already reviewed the shop
      // else return 'does not exist'
    let reviewId = await this.checkReview(shopLoc.uid, userUid);
    console.log('Review Id: ' + reviewId);
    // This is the doc refrence for the shop we are reviewing
    const shopDocRef = doc(this.ShopCollection, shopLoc.uid);
    const curShopReviewCollection = collection(shopDocRef, 'reviews');

    if(reviewId === 'Does Not Exist') {
      await addDoc(curShopReviewCollection, {
        userUid: userUid,
        review: review,
        rating: rating,
        date: new Date(),
      });
    } else {
      const reviewDocRef = doc(curShopReviewCollection, reviewId.toString());
      await updateDoc(reviewDocRef, {
        review: review,
        rating: rating,
        date: new Date(),
      });
    }

  } // End of publishReview()

  // This function will check if there is a shop document in the shops collection
  async checkShop(shopUid: string): Promise<boolean> {
    const shopDocRef = doc(this.ShopCollection, shopUid);
    const shopDoc = await getDoc(shopDocRef);
    if (shopDoc.exists()) {
      return true;
    } else {
      return false;
    } 
  } // End of checkShop()

  // This function will get all the add a new shop to the shops collection
    // *NOTE* a coffee shop will not have a document if there are no reviews
    // we will have to check if the document exists before we add a review
  async addShop( ShopLoc: ShopLocation) {
    const shopDocRef = doc(this.ShopCollection, ShopLoc.uid);
    await setDoc(shopDocRef, {
      name: ShopLoc.name,
      address: ShopLoc.address,
      lat: ShopLoc.lat,
      lng: ShopLoc.lng,
      imageUrl: ShopLoc.imageUrl,
      phone_number: ShopLoc.phone_number,
      website: ShopLoc.website,
    });
    console.log('Adding a new shop');
  } // end of addShop()

  // This function will check if the user has already reviewed the shop
    // if the user has reviewed the shop we will return the review id
    // else return 'does not exist'
    // we used a query to get the review id of the user just to show how to use a query
    // there is only one review per user so we limited the query to 1
  async checkReview(shopUid: string, userUid: string): Promise<String> {
    return new Promise<string>(async (resolve, reject) => {
      const shopDocRef = doc(this.ShopCollection, shopUid);
      const curShopReviewCollection = collection(shopDocRef, 'reviews');
      const q = query(curShopReviewCollection, where('userUid', '==', userUid), limit(1));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        resolve('Does Not Exist');
      
      } else {
        querySnapshot.forEach((doc) => {
          resolve(doc.id);
        });
      }
      reject('Error: Could not check review');
    });
  } // End of checkReview()



}
