# Coffee Realm

Coffee Realm is a full-stack web application designed to help users discover local coffee shops. Built with Angular, Bootstrap, and Google Maps API, this app offers a user-friendly interface and a robust feature set to enhance the coffee shop discovery experience.

## Features

- **Discover Local Coffee Shops:** Utilize the Google Maps API to fetch and display real-time information about nearby coffee shops based on user location.
- **User Profiles:** Create and manage user profiles, including the ability to edit profile information and favorites.
- **Blog Posts:** Users can create blog posts related to their coffee shop experiences.
- **Ratings and Reviews:** Rate and review coffee shops, helping other users find the best spots.
- **Favorites:** Save favorite coffee shops for quick access.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend:** Angular, TypeScript, HTML, CSS, Bootstrap
- **Backend:** Node.js (for server-side logic, if applicable)
- **Database:** Firebase (for data storage and user authentication)
- **APIs:** Google Maps API (for location-based data)
- **CI/CD:** GitHub Actions (for continuous integration and deployment)

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/coffee-realm.git
cd coffee-realm
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Set Up Firebase:**

   - Create a Firebase project and set up Firestore and Authentication.
   - Copy the Firebase configuration object from your Firebase project settings.
   - Create a file named `environment.ts` inside the `src/environments` folder and add your Firebase configuration:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
```

4. **Run the Application:**

```bash
ng serve
```

   - Open your browser and navigate to `http://localhost:4200`.

## Usage

1. **Sign Up / Log In:**
   - Create a new account or log in with an existing account using Firebase Authentication.

2. **Discover Coffee Shops:**
   - Use the map interface to find coffee shops near your location.

3. **Create and Manage Profile:**
   - Access your profile to update information and manage your settings.

4. **Interact with Coffee Shops:**
   - Rate, review, and save your favorite coffee shops.

5. **Create Blog Posts:**
   - Share your coffee experiences by creating blog posts.

## Continuous Integration and Deployment

This project uses GitHub Actions for CI/CD:

- **CI Pipeline:** Runs linting, testing, and builds the application on every push to the `main` branch.
- **CD Pipeline:** Automatically deploys the application to Firebase Hosting upon successful completion of the CI pipeline.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.


## Contact

For any inquiries or feedback, please contact.

---

Feel free to customize the README with your specific details, links, and additional information as needed.
