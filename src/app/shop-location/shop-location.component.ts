import { Component, Input } from '@angular/core';
import { ShopLocation } from '../shop-location';

@Component({
  selector: 'app-shop-location',
  templateUrl: './shop-location.component.html',
  styleUrls: ['./shop-location.component.css']
})
export class ShopLocationComponent {
  // This is pretty much a struct 
  @Input() shopLocation!: ShopLocation; //! tells compiler wont be null or undefined

}
