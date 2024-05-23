import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import environment file
import { environment } from 'src/environments/environment';
import { ScriptLoaderService } from './services/api-loader/script-loader.service';

// Google Maps
import { GoogleMapsModule } from '@angular/google-maps';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Component imports
import { AppComponent } from './app.component';
import { CoffeeSearchComponent } from './coffee-shop-comps/coffee-search/coffee-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './coffee-shop-comps/shop-location/shop-location.component';
import { ShopDetailsComponent } from './coffee-shop-comps/shop-details/shop-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogPostComponent } from './blog-comps/blog-post/blog-post.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegistrationComponent } from './login-register/registration/registration.component';
import { BlogListComponent } from './blog-comps/blog-list/blog-list.component';
import { ProfileComponent } from './profile/profile.component';
import { WriteABlogComponent } from './blog-comps/write-a-blog/write-a-blog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export function initializeApi(scriptLoaderService: ScriptLoaderService) {
  return () => scriptLoaderService.addGoogleMapsApi();
}

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
    MatIconModule,
    MatButtonModule,
    GoogleMapsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApi,
      deps: [ScriptLoaderService],
      multi: true
    },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
