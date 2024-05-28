import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription,} from 'rxjs';
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
      //console.log("User has been logged in successfully by AuthService, user: ", this.curentUser?.value?.uid);
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
      const result = await signInWithPopup(this.auth, this.provider);
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
    let message = "";
    await signInWithEmailAndPassword(this.auth, email, password).then(
      (userCedentials) => {
        console.log("User has been logged in successfully");
        message = "Logged in successfully";
      } 
      ).catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          message = 'Wrong password.';
        } else if (errorCode === 'auth/user-not-found') {
          message = 'User not found.';
        } else if (errorCode === 'auth/invalid-credential') {
          message = 'Invalid credentials.';
        } else {
          message = errorMessage;
        }
        console.log(error);
      });
      return message;
  } // END OF loginWithEmailAndPassword
  
  // CREATE USER FUNCTIONS
  async spawnNewUserWithEmail(un: string, email: string, password: string) {
    console.log("Creating user with email and password");
    //console.log("Email: ", email);
    //console.log("password: ", password);
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
