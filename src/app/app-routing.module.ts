import { Component, NgModule } from '@angular/core';
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
import { WriteABlogComponent } from './blog-comps/write-a-blog/write-a-blog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  // Home Page
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home Page'
  },
  // Redirect to home component
  { 
    path: '',   
    redirectTo: '/home', 
    pathMatch: 'full' 
  }, 
  // Search for coffee shops componet
  {
    path: 'coffeeSearchList',
    component: CoffeeSearchComponent,
    title: 'Coffee Shop Search',
  },
  {
    path: 'shopLocationDetails/:id',
    component: ShopDetailsComponent,
    title: 'Coffee Shop Location'
  },
  {
    path: 'blogList',
    component: BlogListComponent,
    title: 'Blog List',
  },
  {
    path: 'blogPost',
    component: BlogPostComponent,
    title: 'Blog Post'
  },
  {
    path: 'writeABlog',
    component: WriteABlogComponent,
    title: 'Write a Blog'

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
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: '404 Page'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
