import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { BlogService } from 'src/app/services/blog/blog.service';
import { CloudStorageService } from 'src/app/services/cloud-storage/cloud-storage.service';


@Component({
  selector: 'app-write-a-blog',
  templateUrl: './write-a-blog.component.html',
  styleUrls: ['./write-a-blog.component.css']
})
export class WriteABlogComponent implements OnInit{

  // These area variables we need to store the current user's id and name
  curAuthSub!: Subscription; 
  curUserSub: Subscription | undefined;
  authorUid: string  = 'author';
  authorName: string = 'author'; 
  

  // This is where we will store the header image file for a blog post
  // we are using a seperate form for images because angular reactive is not practical for images
  blogHeaderImage: File | null = null;
  imgErrorMessage: string | null = null;
  // headerimageUrl!: string | ArrayBuffer | null;


  // This is are main part of the form for writing a blog post
  // reactive form for writing a blog post
  publishBlog = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    reviewContent: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(800)]),
  });
   

  // we are injecting the blog service, auth service, user service, and cloud storage service
  constructor( private blogService: BlogService, private authService: AuthService, 
                 private userService: UserService, private fireStorage: CloudStorageService ) {}
  
  ngOnInit() {

    // This is subscribing to the current auth user and getting the user's uid
    this.curAuthSub = this.authService.currentUser.subscribe((user) => {
      // if the user is found then we are getting the user's uid
      if(user) {
        this.authorUid = user.uid;
        
        // here we are getting the user's display name aka username
        this.userService.getUserDisplayName(this.authorUid)?.subscribe((name) => {
          this.authorName = name;
          console.log('Author name: ' + this.authorName);
        });
      }
      else {
        console.error('No user found');
      }
    });
  } // END OF ngOnInit

  // remeber to unsubscribe from all your observables
  ngOnDestroy() {
    this.curAuthSub.unsubscribe();
    if(this.curUserSub){
      this.curUserSub.unsubscribe();
    }
  }

  // This function is triggered when the user seleces an image for the header of the blog post
  // we are checking if the file is less than 1MB and then storing the file in the headerImage variable
  // we are also converting the file to a base64 string to display the image in the form
  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        this.imgErrorMessage = 'File size exceeds 1MB';
        return;
      } else {
        this.imgErrorMessage = null;
        this.blogHeaderImage = file;
        
        // Convert image to base64
        // to display the image in the form
        // const reader = new FileReader();
        // reader.onload = (e: any) => {
        //   this.headerimageUrl = e.target.result;
        // };
        // reader.readAsDataURL(file);
      }
    }
  }

  // This function is triggered when the user submits the blog post
  // 1. store the image in firebase storage
  // 2. get the image url from firebase storage
  // 3. create the blog post in firestore
  // 4. clear the form
  async submitBlog() {
    if(this.blogHeaderImage && this.publishBlog.valid) {
      // 1. store the image in firebase storage using the cloud storage service
      try {
        await this.fireStorage.uploadImage(this.blogHeaderImage, `blogImages/${this.publishBlog.value.title+this.authorName}`).then(async (url) => {
          // 2. get the image url from firebase storage
          console.log('Image uploaded');
          console.log('Image url: ' + url);
          // 3. create the blog post in firestore
          if(this.publishBlog.value.title && this.publishBlog.value.reviewContent) {
            const blogId = await this.blogService.createBlogPost(url, this.publishBlog.value.title, this.publishBlog.value.reviewContent, this.authorUid, this.authorName);
            console.log('createBgPost() returned: ' + blogId);
            await this.userService.addPublsihedBlogToProfile(this.authorUid, blogId);
          }
        });
      } catch (e) {
        console.error('Error uploading image: ', e);
      }
    }
  }
  

} // End of WriteABlogComponent
