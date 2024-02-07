import { Component, Input } from '@angular/core';
import { ShopLocation } from '../../models/shop-location.model';

@Component({
  selector: 'app-shop-location',
  templateUrl: './shop-location.component.html',
  styleUrls: ['./shop-location.component.css']
})
export class ShopLocationComponent {
  // This is pretty much a struct 
  @Input() shopLocation!: ShopLocation; //! tells compiler wont be null or undefined
  
}
