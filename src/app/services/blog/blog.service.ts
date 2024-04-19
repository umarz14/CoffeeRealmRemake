import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDoc, updateDoc } from '@angular/fire/firestore';

import { Blog } from 'src/app/models/blog.model';

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

  // Im sure there is a better way of handeling this but this will do for now
  // this function will add the blog id to the blog document just created it
  // this is so that we can have a reference to the blog post when we pass it to the blog post component
  // making it easier to access the blog post from the blogs collection to display the blog post
  async addblogIdtoDoc(docId:string) {
    try{
      //const blogCollection = collection(this.firestore, `blogs`);
      const blogDoc = doc(this.firestore, `blogs/${docId}`);
      await updateDoc( blogDoc, {blogId: docId});
      
    } catch(e) {
      console.error('Error adding blog id to blog document', e);
    }
  }

  // This function will get a blog post by its id
  async getBlogPost(blogId: string): Promise<Blog> {
    return new Promise(async (resolve, reject) => {
      if(!blogId) {
        console.error('Missing required fields');
        reject('Missing required fields');
      }
      console.log('Getting blog post');
      if(blogId) {
        const blogDoc = doc(this.firestore, `blogs/${blogId}`);
        try {
          const blogDocSnap = await getDoc(blogDoc);
          if(blogDocSnap.exists()) {
            console.log('Blog post found');
            const blogPost = blogDocSnap.data() as Blog;
            resolve(blogPost);
          } else {
            console.error('Blog post not found');
            reject('Blog post not found');
          }
        } catch (e) {
          console.error('Error getting blog post', e);
          reject('Error getting blog post');
        }
      }
    }); // return promise
  } // END OF getBlogPostById


}
