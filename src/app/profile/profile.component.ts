import { Component, OnInit, inject} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

import { GoogleMapsJsApiService } from '../services/google-maps-js-api/google-maps-js-api.service';
import { CloudStorageService } from '../services/cloud-storage/cloud-storage.service';

import { User } from '../models/user.model';
import { ShopLocation } from '../models/shop-location.model';
import { Blog } from '../models/blog.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  // These are initial variables needed for the profile component
  isLoaded: boolean = false;
  uid: string | null = null;
  userProfile: any;
  favCoffeeShopsIdList: string[] = [];
  favCoffeeShopsList: ShopLocation[] = [];
  authoredBlogs: Blog[] = [];

  curUserData!: User; 
  private userSubscription?: Subscription;
  private userProfileSubscription?: Subscription;

  // This is injecting the Storage service of firebase
  private readonly storage: Storage = inject(Storage);

  // This is the object that will be used to update the user's profile
  updateProfile = { pfp: null, bio: '' };
  pfpErrorMessage: string | null = null;
  bioErrorMessage: string | null = null;

  constructor(private authService: AuthService, private userService: UserService, 
    private googleMapsJsApiService: GoogleMapsJsApiService, private cs: CloudStorageService) {
  } // END OF constructor


  // This function is called when the component is initialized
  // it subscribes to the currentUser observable to get the current user
  // it then subscribes to the user profile observable to get the user's profile
  // it sets the isLoaded flag to true when the user profile is loaded
  async ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe(async (user) => {
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
        this.favCoffeeShopsIdList = await this.userService.getFavCoffeeShops(this.uid);
        for(let id of this.favCoffeeShopsIdList) {
          console.log('id: ', id)
          let shop: ShopLocation = await this.googleMapsJsApiService.getCoffeeShopGoogleDetailsById(id);
          this.favCoffeeShopsList.push(shop);
        }
        this.authoredBlogs = await this.userService.getAuthoredBlogsList(this.uid);
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


  // This function is called when the user submits the form
  async onSubmit(form: any) {
    if (form.valid) {
      if (this.updateProfile.pfp) {
        console.log('updating pfp');
        const newpfp = await this.cs.uploadImage(this.updateProfile.pfp, 'users_pfp/' + this.uid + '.jpg');
        console.log('newpfp: ', newpfp);
        this.userService.updateUserProfilePic(this.uid, newpfp);
      }
      if (this.updateProfile.bio) {
        if (this.validateBio()) {
          this.bioErrorMessage = null;
          console.log('updating bio' + this.updateProfile.bio);
          this.userService.updateUserProfileBio(this.uid,this.updateProfile.bio);
        }
        else {
          console.log('bio is empty');
          this.bioErrorMessage = 'Bio cannot be empty';
          this.updateProfile.bio = '';
          return;
        }
      }
      form.reset();
    }
  }

  // This function is called when the user selects a file to upload
  // it updates the updateProfile.pfp object with the selected file if it does not exceed 5MB
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        this.pfpErrorMessage = 'File size exceeds 1MB';
        return;
      }
      this.pfpErrorMessage = null;
      this.updateProfile.pfp = file;
    }
  } // END OF onFileSelect

  // Makes sure the bio is not empty or just whitespace
  validateBio(): boolean {
    if (this.updateProfile.bio && this.updateProfile.bio.trim() !== '')
      return true;
    else {
      return false;
    }
  } // END OF validateBio


  // this should be in a service
  // updateProfilePic() {
  //   if(this.updateProfile.pfp) {
  //     // This a reference to the storage location where the file will be uploaded
  //     // The file will be uploaded to the users_pfp folder with the name lol
  //     const storageRef = ref(this.storage, 'users_pfp/' + this.uid + '.jpg');
  //     // This is the function that uploads the file to the storage location
  //     const uploadTask = uploadBytesResumable(storageRef, this.updateProfile.pfp);
      
  //     uploadTask.then((snapshot) => {
  //       console.log('File uploaded successfully');
  //       // You can perform additional actions here after the file is uploaded successfully
  //     }).catch((error) => {
  //       console.log('File upload failed:', error);
  //       // Handle the error if the file upload fails
  //     });

  //     getDownloadURL(storageRef).then((url) => { 
  //       console.log('URL: ', url); 
  //       this.userService.updateUserProfile(this.uid, url, this.updateProfile.bio);
  //     });

    
  //   }

  // } // END OF updateProfilePic
  
} // END OF ProfileComponent
