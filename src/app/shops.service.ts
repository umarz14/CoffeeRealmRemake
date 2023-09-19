import { Injectable } from '@angular/core';
import { ShopLocation } from './shop-location';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  shopLocationList: ShopLocation [] =
  [
    {'name': 'Coffee House', 'placeId': 'ChIJN1t_tDeuEmsRUsoyG83frY4', 'photo': 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvZmZlZSUyMHNob3BzfGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-1234', 'address': '123 Main St.', 'website': 'coffeehouse.com', 'rating': 4, 'times_open': 'Monday-Friday: 7am - 7pm, Saturday-Sunday: 8am - 6pm', 'latitude': 32.7157, 'longitude': -117.1611}, 
    {'name': 'Brewed Awakening', 'placeId': 'ChIJrTLr-GyuEmsRBfy61i59si0', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-5678', 'address': '456 Elm St.', 'website': 'brewedawakening.com', 'rating': 1, 'times_open': 'Monday-Saturday: 6am - 9pm, Sunday: 7am - 8pm', 'latitude': 32.9595, 'longitude': -117.2653}, 
    {'name': 'The Daily Grind', 'placeId': 'ChIJLfySpTOuEmsRsc_JfJtljdc', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-9012', 'address': '789 Oak St.', 'website': 'thedailygrind.com', 'rating': 5, 'times_open': 'Monday-Sunday: 6am - 10pm', 'latitude': 33.1581, 'longitude': -117.3506}, 
    {'name': 'Java Jive', 'placeId': 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-3456', 'address': '321 Pine St.', 'website': 'javajive.com', 'rating': 4, 'times_open': 'Monday-Friday: 5am - 8pm, Saturday-Sunday: 6am - 7pm', 'latitude': 32.64, 'longitude': -117.0842}, 
    {'name': 'Caffeine Fix', 'placeId': 'ChIJM1mOVTSYEmsR7Ds1qJv1ajc', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-7890', 'address': '654 Maple St.', 'website': 'caffeinefix.com', 'rating': 4, 'times_open': 'Monday-Saturday: 7am - 8pm, Sunday: 8am - 6pm', 'latitude': 33.1959, 'longitude': -117.3795}, 
    {'name': 'Perk Up Cafe', 'placeId': 'ChIJiy6YTjKuEmsRkHZAbW7qABM', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-2345', 'address': '987 Cedar St.', 'website': 'perkupcafe.com', 'rating': 1, 'times_open': 'Monday-Friday: 6am - 9pm, Saturday-Sunday: 7am - 8pm', 'latitude': 32.8328, 'longitude': -117.2713}, 
    {'name': 'Bean Scene', 'placeId': 'ChIJ_5-P0TiuEmsRHrcutjOv_6Y', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-6789', 'address': '246 Birch St.', 'website': 'beanscene.com', 'rating': 4, 'times_open': 'Monday-Sunday: 5am - 11pm', 'latitude': 32.9628, 'longitude': -117.0359}, 
    {'name': 'Mug Life', 'placeId': 'ChIJwYy_BjKuEmsR0y4O5T2O2Zk', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-0123', 'address': '802 Walnut St.', 'website': 'muglife.com', 'rating': 4, 'times_open': 'Monday-Friday: 7am - 10pm, Saturday-Sunday: 8am - 9pm', 'latitude': 32.5437, 'longitude': -117.03}, 
    {'name': 'Grounds for Celebration', 'placeId': 'ChIJq6qq6jauEmsRJAf7FjrKnXI', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60', 'phone_number': '555-4567', 'address': '135 Cherry St.', 'website': 'groundsforcelebration.com', 'rating': 5, 'times_open': 'Monday-Saturday: 5am - 9pm, Sunday: Closed', 'latitude': 33.0169, 'longitude': -116.846}, 
    {'name': 'Espresso Yourself', 'placeId': 'ChIJLQcbdLGvEmsRuMxvFyNRfbk', 'photo': 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwc2hvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60  ', 'phone_number': '555-8901', 'address': '864 Spruce St.', 'website': 'espressoyourself.com', 'rating': 5, 'times_open': 'Monday-Saturday: 7am - 9pm, Sunday: Closed', 'latitude': 32.9787, 'longitude': -117.0836}
  ];

  constructor() { }

  getAllShopLocations() : ShopLocation[] {
    return this.shopLocationList;
  }

  getShopLocationId(id: string) : ShopLocation | undefined {
    return this.shopLocationList.find(shopLocation => shopLocation.placeId === id);
  }
}
