import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, Auth, getAuth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut} from '@angular/fire/auth';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private provider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor(private router: Router, private userService: UserService) {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
   console.log(aUser?.uid);
  })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }

  getUserUID() {
    if(this.auth.currentUser)
      return this.auth.currentUser?.uid;
    else{
      return "no user";
    }
  }

  // LOGOUT FUNCTION
  async logout() {
    const auth = getAuth();
    await signOut(auth).then(() => {
      console.log("logout successful");
      this.router.navigate(['/']);
    }).catch((error) => {
      // An error happened.
      console.log(error);
      console.log("Error occured while attempting to logout")
    });
  }// end logout

  // LOGIN FUNCTIONS
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      if(result){
        console.log("User has been logged in successfully");
        this.router.navigate(['home'])
      }
      // handle the result
    } catch (error) {
      console.error(error);
      // handle the error
    }
  } // END OF loginWithGoogle

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      if(this.authState$){
        console.log("User has been logged in successfully");
        this.router.navigate(['home']);
      }
    } catch(error) {
      console.error(error);
    }
  } // END OF loginWithEmailAndPassword
  
  // CREATE USER FUNCTIONS
  async spawnNewUserWithEmailAndPassword(email: string, password: string) {
    try{
      await createUserWithEmailAndPassword(this.auth, email, password);
      await this.userService.createUserProfile(this.auth.currentUser?.uid ?? '', {name: "test", email: "email"});
      if(this.authState$){
        console.log("User has been created successfully");
        this.router.navigate(['home'])
      }
    }
    catch(error) {
      console.error(error);
    }
  } // END OF spawnNewUserWithEmailAndPassword

}
