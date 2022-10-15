import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Observable, of } from 'rxjs'
import { map, delay, filter, switchMap } from 'rxjs/operators'
import IUser from '../models/user.model'
import { Router } from '@angular/router'
import { ActivatedRoute, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userCollection = db.collection('users')
    // If user exists, then the user is logged in
    this.isAuthenticated$ = auth.user.pipe(
      map(user => Boolean(user))
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )

    // Getting authOnly thisway will not work this service is outside the router-outlet:
    // this.route.data.subscribe()

    // events emits from router when the user is forced to navigate or called an event
    this.router.events.pipe(
      // After the user is finished navigating to a route
      // the router will emit a NavigationEnd event class
      filter(e => e instanceof NavigationEnd),
      // After we know the navigation is finished
      // we can access the data from the route
      // because router-outlet is loaded at this point.
      // The route store the current route the user is on
      // and represents routes as a tree.
      map(() => this.route.firstChild),
      // Use switchMap to look at the latest route data Observable.
      //
      // '??' is the nullish coalescing operator
      // We use this operator to provide a fallback value
      // for a value that might be null or undefined
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error("Password not provided!")
    }

    // register:
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    )

    if (!userCred.user) {
      throw new Error("User cannot be found")
    }

    // user add data to the 'user' collection in Firebase with the uid generated,
    // add after register or else there will be no token from Firebase for the user
    // to do this action (Stateless authentication):
    await this.userCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    // store displayName to the profile
    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  // $event does not always exist
  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault()
    }

    await this.auth.signOut()

    // Redirect user to Home page:
    // router.navigateByUrl() return a Promise<boolean>
    // need to await and provide absolute path
    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
