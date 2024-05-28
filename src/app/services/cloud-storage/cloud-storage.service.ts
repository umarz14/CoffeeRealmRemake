import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  constructor(private firebaseStorage: Storage) {}

  async getDefaultPfpUrl(): Promise<string> {
    try {
      const storageRef = ref(this.firebaseStorage, 'users_pfp/default-pfp.jpg');
      const url = await getDownloadURL(storageRef);
      if (url) {
        return url;
      } else {
        console.error('Error getting default pfp url');
        return "Error getting default profile image url";
      }
    } catch (error) {
      console.error('Error getting default pfp url', error);
      return "Error getting default profile image url";
    }
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.firebaseStorage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Error uploading image: ', error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  } // END OF uploadImage

}
