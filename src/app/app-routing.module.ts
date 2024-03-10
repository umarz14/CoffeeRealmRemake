import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopLocationComponent } from './coffee-shop-comps/shop-location/shop-location.component';
import { ShopDetailsComponent } from './coffee-shop-comps/shop-details/shop-details.component';
import { CoffeeSearchComponent } from './coffee-shop-comps/coffee-search/coffee-search.component';
import { BlogPostComponent } from './blog-comps/blog-post/blog-post.component';
import { BlogListComponent } from './blog-comps/blog-list/blog-list.component'; 
import { LoginComponent } from './login-register/login/login.component';
import { RegistrationComponent } from './login-register/registration/registration.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'locations',
    component: ShopLocationComponent,
    title: 'Shop Locations'
  },
  {
    path: 'details/:id',
    component: ShopDetailsComponent,
    title: 'Shop Details'
  },
  {
    path: 'coffeeSearch',
    component: CoffeeSearchComponent,
    title: 'Coffee Shop Search'
  },
  {
    path: 'blogPost',
    component: BlogPostComponent,
    title: 'Blog Post'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegistrationComponent,
    title: 'Register'
  },
  {
    path: 'blogList',
    component: BlogListComponent,
    title: 'Blog List'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
