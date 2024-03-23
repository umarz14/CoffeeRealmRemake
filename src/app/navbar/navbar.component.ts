import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  curUserUid: string | null = null;
  pfpUrl: string | null = null; 
  private authSubscription?: Subscription; 
  private pfpSubscription?: Subscription;
  
  constructor(public authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
        if(user) {
          this.curUserUid = user.uid;
          this.pfpSubscription = this.userService.getUserPfp(this.curUserUid)?.subscribe( (pfp) => {
            this.pfpUrl = pfp;
            console.log('pfp url: ' + pfp);
          })
        }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe(); 
    this.pfpSubscription?.unsubscribe();
  }
  

}
