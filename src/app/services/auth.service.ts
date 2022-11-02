import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, of } from 'rxjs'
import { map, delay, filter, switchMap } from 'rxjs/operators'
import IUser from '../models/user.model'
import { Router } from '@angular/router'
import { ActivatedRoute, NavigationEnd } from '@angular/router'
import Response from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false

  // Spring boot User API:
  private readonly apiUrl = "http://localhost:8080/api/v1/user"

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(
    private router: Router,
    private route: ActivatedRoute,

    // Firebase:
    private auth: AngularFireAuth,

    // Spring Boot:
    private http: HttpClient
  ) {
    // If user exists, then the user is logged in
    this.isAuthenticated$ = auth.user.pipe(
      map(user => Boolean(user))
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )

    // Getting authOnly this way will not work this service is outside the router-outlet:
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
      map(() => this.route),
      // Search through the route to get the node that matches the destination
      // (ManageComponent/UploadComponent), it is always a linked list like tree
      // in our case so we just loop through it till the end.
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
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
    await this.http.post<Response>(`${this.apiUrl}/registration`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    }).toPromise()

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
