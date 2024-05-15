;import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, setDoc, docData, updateDoc, deleteDoc, getDoc, getDocs, query, where,  } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private firebaseStorage: CloudStorageService) { }

/*************** THIS SECTION WILL BE DEDICATED TO USER PROFILES ***************/

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

  async getUserImg(uid: string) {
    console.log('Getting user pfp');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      const docSnap = await getDoc(userDoc);
      return docSnap.get('pfp');
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

  // This function will get the username of the user using the user id
    // tho this is a one time document snapshot so we wont be listening for changes
    // document snapshots have the .data() method that returns the document data
    // they also have the .get() method that returns the field value
  async getUsername(uid: string) {
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      const docSnap = await getDoc(userDoc);
      return docSnap.get('userName');
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


/*************** THIS SECTION WILL BE DEDICATED TO FAVORITE COFFEE SHOPS ***************/

  // This function will get the favorite coffee shops from the user's profile
  async getFavoriteCoffeeShopsList(uid: string) {
    console.log('Getting favorite coffee shops from profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserCoffeeShopCollectionRef = collection(curUserDoc, `favoriteCoffeeShops`);
      return getDocs(curUserCoffeeShopCollectionRef);
    }
    return null; // Add this line to return a value outside of the if statement
  } // END OF getFavoriteCoffeeShopsFromProfile 

  // This function will return a boolean value if the coffee shop is a favorite of the user
  async isCoffeeShopAFavorite(uid: string, coffeeShopId: string): Promise<boolean> {
    let isFav = false;
    // console.log('Checking if coffee shop is a favorite');
    if(uid && coffeeShopId) {
      const favShops = await this.getFavoriteCoffeeShopsList(uid);
      if (favShops) {
        favShops.forEach(doc => {
          const docData = doc.data()['coffeeShopId'];
          if( docData === coffeeShopId ) {
            // console.log('Coffee shop is a favorite');
            isFav = true;
          } 
        });
      }
      return isFav;
    }
    return isFav; // Add this line to return a value outside of the if statement
  } // END OF coffeeShopIsAFavorite

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

  // This function will remove a coffee shop from the user's favorite coffee shops
    // this is accomplished using a firebase query 
    // we first get the collection of favorite coffee shops
    // then we query the collection for the coffee shop id that we want to remove
  async removeFavoriteCoffeeShopFromProfile(uid: string, coffeeShopId: string) {
    console.log('Removing coffee shop from profile');
    if(uid && coffeeShopId) {
      const userCollection = collection(this.firestore, `users`);
      const curUserDoc = doc(userCollection, uid);
      const curUserCoffeeShopCollectionRef = collection(curUserDoc, `favoriteCoffeeShops`);
      const q = query(curUserCoffeeShopCollectionRef, where('coffeeShopId', '==', coffeeShopId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log('Coffee shop removed from profile');
      });
    }
  } // END OF removeFavoriteCoffeeShopFromProfile

  

  

  /*************** THIS SECTION WILL BE DEDICATED TO USER COFFEE SHOP REVIEWS ***************/
  // should i create a service for the reviews or should i just do it component side

} // END OF UserService