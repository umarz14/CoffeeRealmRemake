import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog/blog.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit{
  blogId: string = '';
  blogPost!: Blog;
  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  async ngOnInit() {
    this.route.params.subscribe(async params => { 
      this.blogId = params['id'];
      console.log('Will display Blog ' + this.blogId);
     });
    this.blogPost = await this.blogService.getBlogPost(this.blogId);
  }
}
