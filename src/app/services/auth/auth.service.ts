import { Injectable, inject } from '@angular/core';
import { Auth, getAuth, idToken, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import { User } from './user.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private provider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);
  idToken$ = idToken(this.auth);
  idTokenSubscription: Subscription;

  constructor() {
    this.idTokenSubscription = this.idToken$.subscribe((token: string | null) => {
      //handle idToken changes here. Note, that user will be null if there is no currently logged in user.
      console.log(token);
    })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.idTokenSubscription.unsubscribe();
  }

  async signInAnonymously(){
    try {
      await signInAnonymously(this.auth)
      console.log("hello" + this.auth)
    } catch(error) {
      console.error(error);
    }
  
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      // handle the result
    } catch (error) {
      console.error(error);
      // handle the error
    }
  }

  logout() {
    signOut(this.auth).then(() => {
      console.log("logged out");
    }).catch((error) => {
      console.log('sign out error: '+error);
    })
  }// end logout

}
