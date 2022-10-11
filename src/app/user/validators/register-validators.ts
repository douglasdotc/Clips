import { ValidationErrors, AbstractControl } from "@angular/forms";

export class RegisterValidators {
  // static methods can be called without instatiating the class
  // static methods cannot access variables in the class
  // static methods are good for creating utility methods but are limited at their scope
  static match(group: AbstractControl): ValidationErrors | null {
    const control = group.get('password')
    const matchingControl = group.get('confirm_password')

    if (!control || !matchingControl) {
      return { controlNotFound: false }
    }

    const error = control.value === matchingControl.value ? null : { noMatch: true }
    return error
  }
}
