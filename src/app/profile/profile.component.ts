import { Component, OnInit, inject} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

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

  private readonly storage: Storage = inject(Storage);

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

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;

    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.then((snapshot) => {
              console.log('File uploaded successfully');
              // You can perform additional actions here after the file is uploaded successfully
            }).catch((error) => {
              console.log('File upload failed:', error);
              // Handle the error if the file upload fails
            });
        }
    }
  }

} // END OF ProfileComponent
