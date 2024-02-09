import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { idToken, Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut} from '@angular/fire/auth';

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

  async logout() {
    const auth = getAuth();
    await signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
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
    } catch(error) {
      console.error(error);
    }
  } // end loginWithEmailAndPassword
}
