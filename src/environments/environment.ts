export const environment = {
    production: false,
    MY_GOOGLE_MAPS_JS_API_KEY: process.env["NG_APP_GOOGLE_MAPS_JS_API_KEY"] || '',
    firebaseConfig: {
        apiKey: process.env["AN_API_KEY"] || '',
        authDomain: "coffee-realm.firebaseapp.com",
        projectId: "coffee-realm",
        storageBucket: "coffee-realm.appspot.com",
        messagingSenderId: "112481585467",
        appId: "1:112481585467:web:2fdacf93a3653218960f1e",
        measurementId: "G-S504NEPG0N"
    },
};
  