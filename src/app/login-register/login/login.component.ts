import { Component, OnInit, OnDestroy, Optional, } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators
      .required, Validators.email]),
    password: new FormControl(''),
  });

  get email() {
    return this.loginForm.get('email');
  }

  constructor(@Optional() private auth: Auth, public authService: AuthService) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
      });
    }
    
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  async getUser(){
    console.log('testing' + this.auth.currentUser?.uid);
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        console.log('no user');
      }
    });
  }

  async login() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signIn() {
    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);
    try{
      const email = this.loginForm.value.email || '';
      const password = this.loginForm.value.password || '';
      await this.authService.loginWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  } // end tempLogin

  tempLogin() {
    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);
  } // end tempLogin

  


}