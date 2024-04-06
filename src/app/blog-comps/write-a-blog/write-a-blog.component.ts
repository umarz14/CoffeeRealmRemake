import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

import { BlogService } from 'src/app/services/blog/blog.service';


@Component({
  selector: 'app-write-a-blog',
  templateUrl: './write-a-blog.component.html',
  styleUrls: ['./write-a-blog.component.css']
})
export class WriteABlogComponent {

  publishBlog = new FormGroup({
    reviewContent: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(800)]),
    title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    headerImage: new FormControl('', [Validators.required]),
  });

  constructor(private blogService: BlogService){}

  async submitBlog() {
    try{
      await this.blogService.createBlogPost(
        this.publishBlog.value.title ?? '',
        this.publishBlog.value.reviewContent ?? '',
        this.publishBlog.value.headerImage ?? '',
        'author'
      );
      console
    }
    catch(e) {
      console.error('Error submitting blog', e);
    }
  }

}
