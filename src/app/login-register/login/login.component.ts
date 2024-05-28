import { Component, OnInit, OnDestroy, Optional, inject, } from '@angular/core';
import { Router } from '@angular/router';
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

  loginMessage = "Logged in successfully";

  showLoginButton = false;
  showLogoutButton = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators
      .required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: Auth, public authService: AuthService, private router:Router ) {
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
    //console.log('testing' + this.auth.currentUser?.uid);
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

  async signInGooglelogin() {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(email: string, password: string) {
    this.loginMessage = await this.authService.loginWithEmailAndPassword(email, password);
    if(this.loginMessage === 'Logged in successfully'){
      console.log('User has been logged in successfully');
      this.router.navigate(['home']);
    } else {
      //console.log('Error occured while attempting to login');
      console.log(this.loginMessage);
      this.loginForm.reset();
    }
  } // end of signIn


}