import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }

  // Alert properties
  showAlert = false
  alertMsg = 'Please wait! we are logging you in.'
  alertColor = 'blue'

  // Submission control
  inSubmission = false

  constructor(
    private auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true
    this.inSubmission = true

    // Reset message and color
    this.alertMsg = 'Please wait! we are logging you in.'
    this.alertColor = 'blue'

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )

    } catch (e) {
      console.error(e) // Debug
      var errMsg = (e as Error).message
      this.alertMsg = errMsg
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Success! You are now logged in.'
    this.alertColor = 'green'
  }
}
