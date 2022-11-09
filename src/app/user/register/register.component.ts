import { RegisterValidators } from './../validators/register-validators';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'
import IUser from 'src/app/models/user.model';
import { EmailTaken } from '../validators/email-taken';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { delay, map } from 'rxjs/operators'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(10),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm) // regex
  ])
  confirm_password = new FormControl('', [
    Validators.required,

  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [
    RegisterValidators.match('password', 'confirm_password')
  ])

  // Alert properties
  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'

  // Submission control
  inSubmission = false

  constructor(
    private auth: AuthService,
    private sessionStorageService: SessionStorageService,
    private emailTaken: EmailTaken
  ) {}

  // async function return a Promise Object
  async register() {
    this.showAlert = true
    this.inSubmission = true

    // Reset message and color
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'

    await this.auth.createUser(this.registerForm.value as IUser)
    this.auth.authenticate(
      (this.registerForm.value.email as string),
      (this.registerForm.value.password as string)
    )
    .pipe(
      map(user => {
        if (user) {
          this.auth.isAuthenticated = Boolean(user)
        }
        return user
      }),
      delay(1000),
      map(user => {
        if (user) {
          this.auth.isAuthenticatedWithDelay = Boolean(user)
        }
        return user
      })
    )
    .subscribe({
      next: user => {
        this.sessionStorageService.saveUser(user as IUser)
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

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green'
  }
}
