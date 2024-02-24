import { Component } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { Blog } from 'src/app/models/blog.model';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent {
  blogs$: Observable<Blog[]>;
  constructor( private firestore: Firestore ) {
    const blogCollection = collection(this.firestore, 'blogs');
    this.blogs$ = collectionData(blogCollection) as Observable<Blog[]>;
  }
}
