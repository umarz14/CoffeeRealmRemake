import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { CollectionReference, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore,) {}
  async createUserProfile(uid: string, userProfile:{name: string, email: string}) {
    console.log('Creating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      try {
        await setDoc(userDoc, userProfile);
        console.log('User profile created');
      } catch (e) {
        console.error('Error creating user profile', e);
      }
    }
  }
}