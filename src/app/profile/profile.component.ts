import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  isLoaded: boolean = false;
  uid: string | null = null;
  userProfile: any;
  private userSubscription?: Subscription;
  private userProfileSubscription?: Subscription;

  constructor(private authService: AuthService, private userService: UserService) {
  } // END OF constructor

  ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe((user) => {
      if(user) {
        this.uid = user.uid;
        console.log('User is logged in on profile component, uid: ', this.uid);
        this.userProfileSubscription = this.userService.getUserProfile(this.uid)?.subscribe(
          profile => {
            this.userProfile = profile;
            console.log('User profile: ', this.userProfile);
            this.isLoaded = true;
          }
        )
      }
      else {
        this.isLoaded = false;
        console.log('No user is logged in on profile component');
      }
    });
  } // END OF ngOnInit

  ngOnDestroy() {
    this.userProfileSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  } // END OF ngOnDestroy

} // END OF ProfileComponent
