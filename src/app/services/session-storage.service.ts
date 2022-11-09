import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators'

const USER_KEY = 'authUser'

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  clean() {
    window.sessionStorage.clear()
  }

  public saveUser(user: any) {
    window.sessionStorage.removeItem(USER_KEY)
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  public getUser() {
    const user = window.sessionStorage.getItem(USER_KEY);
    return (user) ? JSON.parse(user) : {}
  }

  public isLoggedIn() {
    const user = window.sessionStorage.getItem(USER_KEY);
    return Boolean(user)
  }
}
