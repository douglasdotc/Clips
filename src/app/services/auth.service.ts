import { SessionStorageService } from './session-storage.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { map, filter, switchMap } from 'rxjs/operators'
import IUser from '../models/user.model'
import { Router } from '@angular/router'
import { ActivatedRoute, NavigationEnd } from '@angular/router'
import Response from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = false
  public isAuthenticatedWithDelay = false
  private redirect = false

  // Spring boot User API:
  private readonly apiUrl = "http://localhost:8080/api/v1/auth"
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(
    private router: Router,
    private route: ActivatedRoute,

    // Spring Boot:
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {
    // If user exists, then the user is logged in
    this.isAuthenticated = sessionStorageService.isLoggedIn()
    this.isAuthenticatedWithDelay = this.isAuthenticated

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

  public authenticate(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password
    },
    this.httpOptions)
  }

  public async fetchUserByEmail(email: string) {
    return await this.http.get<Response>(`${this.apiUrl}/fetchUserByEmail`, {
      params : new HttpParams().set('email', email)
    }).toPromise()
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error("Password not provided!")
    }

    // Register user:
    const response = await this.http.post<Response>(`${this.apiUrl}/register`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    },
    this.httpOptions).toPromise()

    if (!response?.data.isRegistered) {
      throw new Error("Registration failed!")
    }

    // Authenticate user (Login):
    this.authenticate(userData.email, userData.password)
  }

  // $event does not always exist
  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault()
    }

    await this.http.post(`${this.apiUrl}/logout`, {}).toPromise()
    this.sessionStorageService.clean()

    this.isAuthenticated = false
    this.isAuthenticatedWithDelay = this.isAuthenticated

    // Redirect user to Home page:
    // router.navigateByUrl() return a Promise<boolean>
    // need to await and provide absolute path
    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
