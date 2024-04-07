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

  curAuthSub!: Subscription; 
  curUserSub: Subscription | undefined;
  authorId: string  = 'author';
  authorName: string = 'author'; 

  imgErrorMessage: string | null = null;
   

  publishBlog = new FormGroup({
    reviewContent: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(800)]),
    title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    headerImage: new FormControl('', [Validators.required]),
  });

  constructor(
    private blogService: BlogService, private authService: AuthService, 
    private userService: UserService, private fireStorage: CloudStorageService,
  ) {}
  
  ngOnInit() {

    // This is subscribing to the current auth user and getting the user's uid
    this.curAuthSub = this.authService.currentUser.subscribe((user) => {
      if(user) {
        this.authorId = user.uid;
        
        // this is getting the user's display name
        this.userService.getUserDisplayName(this.authorId)?.subscribe((name) => {
          this.authorName = name;
          console.log('Author name: ' + this.authorName);
        });
      }
      else {
        console.error('No user found');
      }
    });
  } // END OF ngOnInit

  ngOnDestroy() {
    this.curAuthSub.unsubscribe();
    this.curUserSub?.unsubscribe();
  }

  async submitBlog() {
    if(this.authorId && this.authorName && this.publishBlog.valid && this.publishBlog.value.headerImage){
      try{
        //await this.fireStorage.uploadImage(this.publishBlog.value.heade, 'blog-header-images');
        await this.blogService.createBlogPost(
          this.publishBlog.value.title ?? '',
          this.publishBlog.value.reviewContent ?? '',
          this.publishBlog.value.headerImage ?? '',
          this.authorId, 
          this.authorName,
        );
        console
      }
      catch(e) {
        console.error('Error submitting blog', e);
      }
    } else {
      console.error('something went wrong with the form');
    }
  }
  // this function is called when the user selects an image
  // to check the image type and size
  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxSize = 1 * 1024 * 1024; // 1mb
      if (file.size > maxSize) {
        this.imgErrorMessage = 'File size exceeds 1MB';
        return;
      }
      this.imgErrorMessage = null;
    }
  }// END OF onImageSelected

  // upload header image
  

}
