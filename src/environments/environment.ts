// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDqRi0GtMmiJccdbCSv8uJViD1cHcYGmek", // key to connect to Firebase
    authDomain: "clips-ec6fd.firebaseapp.com", // needed to login users to our app
    projectId: "clips-ec6fd", // ID of the project
    storageBucket: "clips-ec6fd.appspot.com", // to describe the location of the data stored
    // messagingSenderId: "1066511690986", // feature that push notification to app instantly
    appId: "1:1066511690986:web:87e88c8fde772877a4fb93" // app ID that connect to the project
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
