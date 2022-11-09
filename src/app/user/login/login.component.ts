import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { map, delay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

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
    private auth: AuthService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true
    this.inSubmission = true

    // Reset message and color
    this.alertMsg = 'Please wait! we are logging you in.'
    this.alertColor = 'blue'

    this.auth.authenticate(this.credentials.email, this.credentials.password)
    .pipe(
      map(user => this.auth.isAuthenticated = Boolean(user)),
      delay(1000),
      map(user => this.auth.isAuthenticatedWithDelay = Boolean(user))
    )
    .subscribe({
      next: data => {
        this.sessionStorageService.saveUser(data)
      },
      error: err => {
        console.error(err) // Debug
        var errMsg = (err as Error).message
        this.alertMsg = errMsg
        this.alertColor = 'red'
        this.inSubmission = false
        return
      }
    })

    this.alertMsg = 'Success! You are now logged in.'
    this.alertColor = 'green'
  }
}
