import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private firestore: Firestore) { }

  async createBlogPost(title: string, content: string, headerImage: string, author: string) {
    console.log('Creating blog post');
    if(title && content && headerImage && author) {
      const blogCollection = collection(this.firestore, `blogs`);
      const blogDoc = doc(blogCollection, title);
      try {
        await addDoc(blogCollection,{
          title: title,
          content: content,
        }).then((documentRef) => {
          console.log('Document written with ID: ', documentRef.id);
        });
        console.log('Blog post created');
      } catch (e) {
        console.error('Error creating blog post', e);
      }
    }
  } // END OF createBlogPost


}
