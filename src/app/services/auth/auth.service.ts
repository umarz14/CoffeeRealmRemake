import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User,user, Auth, getAuth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private provider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor(private router: Router) {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
   console.log(aUser?.uid);
  })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
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

  

  async spawnNewUserWithEmailAndPassword(email: string, password: string) {
    try{
      await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("User created successfully");
    }
    catch(error) {
      console.error(error);
    }
  } // end createUserWithEmailAndPassword

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log("User logged in successfully");
      this.router.navigate(['blogs'])
    } catch(error) {
      console.error(error);
    }
  } // end loginWithEmailAndPassword
}
