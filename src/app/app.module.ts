import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule} from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoffeeSearchComponent } from './coffee-shop-comps/coffee-search/coffee-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './coffee-shop-comps/shop-location/shop-location.component';
import { ShopDetailsComponent } from './coffee-shop-comps/shop-details/shop-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogsComponent } from './blog-comps/blogs/blogs.component';
import { BlogPostComponent } from './blog-comps/blog-post/blog-post.component';
import { LoginComponent } from './login-register/login/login.component';
import { getAuth,provideAuth } from '@angular/fire/auth';
import { RegistrationComponent } from './login-register/registration/registration.component';
import { BlogListComponent } from './blog-comps/blog-list/blog-list.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    CoffeeSearchComponent,
    NavbarComponent,
    HomeComponent,
    ShopLocationComponent,
    ShopDetailsComponent,
    BlogsComponent,
    BlogPostComponent,
    LoginComponent,
    RegistrationComponent,
    BlogListComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
