import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  loading: boolean = false;
  userProfile: any;
  test: string | null = "Hello World";
  constructor(private authService: AuthService, private userService: UserService) {
    this.test = this.authService.aUser?.uid ?? null;
    console.log('User ID in profile constrtvoy: ', this.test);
  } // END OF constructor
  async ngOnInit() {
    try {
      console.log('Getting user profile');
      this.loading = true;
      if (this.authService.aUser) {
        console.log('User is logged in');
        // this.userProfile = await this.userService.getUserProfile(this.authService.aUser.uid);
        console.log('User profile retrieved');
      } else {
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error('Error getting user profile', error);
    } finally {
      this.loading = false;
      console.log('User profile retrieval complete');
    }
  }
}
