;import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, docData, updateDoc } from '@angular/fire/firestore';
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
      const userDoc = doc(userCollection, uid);
      await updateDoc(userDoc, {
        publishedBlogs: blogId
      });
      console.log('Blog added to profile');
    }
  } // END OF addPublsihedBlogToProfile




} // END OF UserService