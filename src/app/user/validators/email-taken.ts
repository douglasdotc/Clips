import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";

// static methods cannot access variables including services
// email validation requires response from database to check if
// email exists and that is a service. We will make the validation
// non-static and put this in the following injectable class.
// With this, we can inject this method into other class to check emails
@Injectable({
  // Tell Angular that this class is injectable to root:
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(
    private auth: AngularFireAuth
  ) { }

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return this.auth.fetchSignInMethodsForEmail(control.value).then(
      response => response.length ? { emailTaken: true } : null
    )
  }
}

// Angular will only fire asynchronous validators until every synchronous valiators
// are satisfied. Async. Validators require resources from server. It is not a good
// practice to request on every changes to the form control. Angular get around this
// by waiting all synchronous validators to be satisfied.
