;import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, setDoc, docData, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private firebaseStorage: CloudStorageService) { }

  async createUserProfile(uid: string, userName: string, email: string) {
    console.log('Creating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      try {
        const pfpUrl = await this.firebaseStorage.getDefaultPfpUrl();
        if(pfpUrl) {
          await setDoc(userDoc, {
            uid: uid,
            userName: userName,
            email: email,
            created: new Date(),
            bio: "Hello Everyone! I'm new to the app!",
            pfp: pfpUrl,
          });
          console.log('User profile created');
        }
        else {
          console.error('Error getting default pfp url');
        }
      } catch (e) {
        console.error('Error creating user profile', e);
      }
    }
  } // END OF createUserProfile

  getUserProfile(uid: string) {
    console.log('Getting user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      return docData(userDoc);
    }
    return null; // Add this line to return a value outside of the if statement
  } // END OF getUserProfile

  getUserPfp(uid: string) {
    console.log('Getting user pfp');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      return docData(userDoc).pipe(map(curUserDoc => curUserDoc ? curUserDoc['pfp']:undefined));
      
    }
    return null; // Add this line to return a value outside of the if statement
  } // END OF getUsersPfp

  getUserDisplayName(uid: string) {
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      return docData(userDoc).pipe(map(curUserDoc => curUserDoc ? curUserDoc['userName']:undefined));
    }
    return null;
  }
  

  async updateUserProfile(uid: string | null, pfp: string, bio: string) {
    console.log('Updating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      // if there is no bio, only update the pfp
      if(pfp && !bio){
        await setDoc(userDoc, {
          pfp: pfp
        }, { merge: true });
        console.log('User profile (pfp) updated');
      }
      // if there is no pfp, only update the bio
      else if(bio && !pfp){
        console.log('Updating bio to: ', bio);
        await updateDoc(userDoc,{bio: bio});
        console.log('User profile (bio) updated');
      }
      else if(pfp && bio){
      await setDoc(userDoc, {
        pfp: pfp,
        bio: bio
      }, { merge: true });
      console.log('User profile updated');
      }
      else {
        console.log('No changes to update');
      }
    }
  } // END OF updateUserProfile

  //We have a function that adds blogs created/Authored and liked (liked might be delayed) by the user to the user's profile
  // Im thinkng we can have create docs storing an array and just adding that id to the array

  async addPublsihedBlogToProfile(uid: string, blogId: string) {
    console.log('Adding blog to profile');
    if(uid && blogId) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserBlogCollectionRef = collection(curUserDoc, `publishedBlogs`);
      await addDoc(curUserBlogCollectionRef, {
        blogId: blogId
      });
      console.log('Blog added to profile');
    }
  } // END OF addPublsihedBlogToProfile


  // THIS SECTION WILL BE DEDICATED TO COFEE SHOP FAVORITES

  async addFavoriteCoffeeShopToProfile(uid: string, coffeeShopId: string) {
    console.log('Adding coffee shop to profile');
    if(uid && coffeeShopId) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserCoffeeShopCollectionRef = collection(curUserDoc, `favoriteCoffeeShops`);
      await addDoc(curUserCoffeeShopCollectionRef, {
        coffeeShopId: coffeeShopId
      });
      console.log('Coffee shop added to profile');
    }
  } // END OF addFavoriteCoffeeShopToProfile

  async removeFavoriteCoffeeShopFromProfile(uid: string, coffeeShopId: string) {
    console.log('Removing coffee shop from profile');
    if(uid && coffeeShopId) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserCoffeeShopCollectionRef = collection(curUserDoc, `favoriteCoffeeShops`);
      const curUserCoffeeShopDoc = doc(curUserCoffeeShopCollectionRef, coffeeShopId);
      await deleteDoc(curUserCoffeeShopDoc);
      console.log('Coffee shop removed from profile');
    }
  } // END OF removeFavoriteCoffeeShopFromProfile

  // This function will get the favorite coffee shops from the user's profile
  async getFavoriteCoffeeShopsList(uid: string) {
    console.log('Getting favorite coffee shops from profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserCoffeeShopCollectionRef = collection(curUserDoc, `favoriteCoffeeShops`);
      return collectionData(curUserCoffeeShopCollectionRef);
    }
    return null; // Add this line to return a value outside of the if statement
  } // END OF getFavoriteCoffeeShopsFromProfile 

  // This function will return a boolean value if the coffee shop is a favorite of the user
  async isCoffeeShopAFavorite(uid: string, coffeeShopId: string): Promise<boolean> {
    console.log('Checking if coffee shop is a favorite');
    if(uid && coffeeShopId) {
      const favShops = await this.getFavoriteCoffeeShopsList(uid);
      console.log('Checking if coffee shop is a favorite');
      console.log('checking for coffee shop id: ', coffeeShopId);
      if(favShops) {
        favShops.forEach((doc) => {
          console.log('doc: ', doc);
          console.log('coffee shop id: ', doc['coffeeShopId']);
          // console.log('vs shop id: ', doc.['coffeeShopId']);
          // if(shop.coffeeShopId === coffeeShopId) {
          //   console.log('Coffee shop is a favorite');
          //   return true;
          // } else {
          //   console.log('Coffee shop is not a favorite');
          //   return false;
          
          // }
        });
      }
    }
    return false; // Add this line to return a value outside of the if statement
  } // END OF coffeeShopIsAFavorite






} // END OF UserService