import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'

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
  ])
  age = new FormControl('', [
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
  })

  // Alert properties
  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'

  // Submission control
  inSubmission = false

  // auth service does not need to ne accessed in the template,
  // so private to the component class
  constructor(private auth: AngularFireAuth) {}

  // async function return a Promise Object
  async register() {
    this.showAlert = true
    this.inSubmission = true

    // Reset message and color
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'

    const { email, password } = this.registerForm.value

    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(
        email as string, password as string
      )
      console.log(userCred)

    } catch(e) {
      console.error(e) // Debug
      var errMsg = (e as Error).message
      this.alertMsg = errMsg
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green'
  }
}
