import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { CollectionReference, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore,) { }

  async createUserProfile({ uid, userProfile }: { uid: string; userProfile: { username: string; email: string; }; }) {
    console.log('Creating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      try {
        await setDoc(userDoc, {
          userProfile: {
            userProfile, // Copy existing properties
            // Add or modify properties here
            newProperty: "Some value",
            updatedProperty: "Updated value"
          },
          additionalData: "Some additional data"
        });
        console.log('User profile created');
      } catch (e) {
        console.error('Error creating user profile', e);
      }
    }
  } // END OF createUserProfile
}