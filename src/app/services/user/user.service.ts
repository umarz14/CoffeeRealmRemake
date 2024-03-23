;import { Injectable } from '@angular/core';
import { Firestore, collection, doc, collectionData, addDoc,getDoc, setDoc, docData, docSnapshots } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

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

  getUserPfp(uid: string) {
    console.log('Getting user pfp');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      return docData(userDoc).pipe(map(curUserDoc => curUserDoc ? curUserDoc['pfp']:undefined));
      
    }
    return null; // Add this line to return a value outside of the if statement
  } // END OF getUsersPfp
  

  updateUserProfile(uid: string | null, pfp: string, bio: string) {
    console.log('Updating user profile');
    if(uid) {
      const userCollection = collection(this.firestore, `users`);
      const userDoc = doc(userCollection, uid);
      // if there is no bio, only update the pfp
      if(pfp && !bio){
        setDoc(userDoc, {
          pfp: pfp
        }, { merge: true });
        console.log('User profile updated');
      
      }
      // if there is no pfp, only update the bio
      else if(!pfp && bio){
        setDoc(userDoc, {
          bio: bio
        }, { merge: true });
        console.log('User profile updated');
      }
      else if(pfp && bio){
      setDoc(userDoc, {
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



} // END OF UserService