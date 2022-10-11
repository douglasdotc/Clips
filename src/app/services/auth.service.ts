import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import IUser from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.userCollection = db.collection('users')
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
}
