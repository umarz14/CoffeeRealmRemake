import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private firestore: Firestore) { }

  // This function creates a blog post and returns the document id of the blog post created in the firestore database 
  async createBlogPost(headerImage: string, title: string, content: string, authorUid: string, authorName: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if(!headerImage || !title || !content || !authorUid) {
        console.error('Missing required fields');
        reject('Missing required fields');
      }
      console.log('Creating blog post');
      if(title && content && headerImage && authorUid) {
        const blogCollection = collection(this.firestore, `blogs`);
        const now = new Date();
        const date = now.toLocaleDateString();
        try {
          await addDoc(blogCollection,{
            headerImageUrl: headerImage,
            title: title,
            content: content,
            authorUid: authorUid,
            authorUsername: authorName,
            date: date
          }).then(async (documentRef) => {
            console.log('Document written with ID: ', documentRef.id);
            resolve(documentRef.id);
          });
          console.log('Blog post created');
        } catch (e) {
          console.error('Error creating blog post', e);
          reject('Error creating blog post');
        }
      }
    }); // return promise
  } // END OF createBlogPost


}
