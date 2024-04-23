import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule} from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'environment';

import { AppComponent } from './app.component';
import { CoffeeSearchComponent } from './coffee-shop-comps/coffee-search/coffee-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './coffee-shop-comps/shop-location/shop-location.component';
import { ShopDetailsComponent } from './coffee-shop-comps/shop-details/shop-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogPostComponent } from './blog-comps/blog-post/blog-post.component';
import { LoginComponent } from './login-register/login/login.component';
import { getAuth,provideAuth } from '@angular/fire/auth';
import { RegistrationComponent } from './login-register/registration/registration.component';
import { BlogListComponent } from './blog-comps/blog-list/blog-list.component';
import { ProfileComponent } from './profile/profile.component';
import { WriteABlogComponent } from './blog-comps/write-a-blog/write-a-blog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { map } from 'rxjs';
import { AppRoutingModule } from './app-routing.module'; // Import the AppRoutingModule module

import { GoogleMap } from '@angular/google-maps';


@NgModule({
  declarations: [
    AppComponent,
    CoffeeSearchComponent,
    NavbarComponent,
    HomeComponent,
    ShopLocationComponent,
    ShopDetailsComponent,
    BlogPostComponent,
    LoginComponent,
    RegistrationComponent,
    BlogListComponent,
    ProfileComponent,
    WriteABlogComponent,
    PageNotFoundComponent,
  ],

    imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      HttpClientJsonpModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      FormsModule,
      // The GoogleMap module is imported here
      GoogleMap,
      // The firebase modules are imported here
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      provideStorage(() => getStorage()),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
