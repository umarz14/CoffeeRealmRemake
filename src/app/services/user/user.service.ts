;import { Injectable } from '@angular/core';
import { Firestore, collection, doc, collectionData, addDoc,getDoc, setDoc, docData, docSnapshots } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore,) { }

  async createUserProfile(uid: string, userName: string, email: string) {
    console.log('Creating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      try {
        await setDoc(userDoc, {
          uid: uid,
          userName: userName,
          email: email,
          created: new Date(),
          bio: "Hello Everyone! I'm new to the app!"
        });
        console.log('User profile created');
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

} // END OF UserService