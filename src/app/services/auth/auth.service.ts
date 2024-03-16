import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, retry } from 'rxjs';
import { User, Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut} from '@angular/fire/auth';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private curentUser = new BehaviorSubject<User | null>(null);
  private provider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);  // Inject the Auth service from angular/fire/auth
  authState$ = authState(this.auth); // Observable of the current authentication state
  authStateSubscription: Subscription; // Subscription to the authState$ observable


  constructor(private router: Router, private userService: UserService) {
    this.authStateSubscription = this.authState$.subscribe((user) => {
      this.curentUser.next(user);
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      console.log("User has been logged in successfully by AuthService, user: ", this.curentUser?.value?.uid);
    })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }

  get currentUser() {
    return this.curentUser.asObservable();
  }
  
  // LOGOUT FUNCTION
  async logout() {
    await signOut(this.auth).then(() => {
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
    console.log("Logging in with email and password");
    console.log("Email: ", email);
    console.log("password: ", password);
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
  async spawnNewUserWithEmail(un: string, email: string, password: string) {
    console.log("Creating user with email and password");
    console.log("Email: ", email);
    console.log("password: ", password);
    try{
      await createUserWithEmailAndPassword(this.auth, email, password);
      await this.userService.createUserProfile(this.auth.currentUser?.uid ?? '', un, email);
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
