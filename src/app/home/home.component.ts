import { ImplicitReceiver } from '@angular/compiler';
import { Component,inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMapsJsApiService } from '../services/google-maps-js-api/google-maps-js-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  constructor(private googleMapsApi: GoogleMapsJsApiService) {}

  async ngOnInit() {
    try {
      this.googleMapsApi.initService();
    } catch (err) {
      console.log(err);
    }
    
  }
}
