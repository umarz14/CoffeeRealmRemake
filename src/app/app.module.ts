import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoffeeSearchComponent } from './coffee-search/coffee-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './shop-location/shop-location.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CoffeeSearchComponent,
    NavbarComponent,
    HomeComponent,
    ShopLocationComponent,
    ShopDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
