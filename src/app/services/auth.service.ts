import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import IUser from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  public async createUser(userData: IUser) {
    // register:
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    )

    // Add data to the 'user' collection in Firebase:
    await this.db.collection('users').add({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })
  }
}
