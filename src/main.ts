import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

if (environment.production) {
  enableProdMode();
}

// Initialize firebase:
firebase.initializeApp(environment.firebase)

// Check if the user signed in status changed,
// if yes and the app has not initialized, we start the app again:
let appInit = false
firebase.auth().onAuthStateChanged(() => {
  if (!appInit) {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  }
  appInit = true
})
