import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './shop-location/shop-location.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'locations',
    component: ShopLocationComponent,
    title: 'Shop Locations'
  },
  {
    path: 'details/:placeId',
    component: ShopDetailsComponent,
    title: 'Shop Details'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
