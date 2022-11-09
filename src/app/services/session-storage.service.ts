import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IUser from '../models/user.model';

const USER_KEY = 'authUser'

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  clean() : void {
    window.sessionStorage.clear()
  }

  public saveUser(user: IUser) : void {
    window.sessionStorage.removeItem(USER_KEY)
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  public getUser() : IUser {
    const user = window.sessionStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : {}
  }

  public isLoggedIn() : boolean {
    const user = window.sessionStorage.getItem(USER_KEY)
    return Boolean(user)
  }
}
