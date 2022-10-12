import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
  // static methods can be called without instatiating the class
  // static methods cannot access variables in the class
  // static methods are good for creating utility methods but are limited at their scope
  static match(controlName: string, matchingConatrolName: string) : ValidatorFn {
    return (group: AbstractControl) : ValidationErrors | null => {
      const control = group.get(controlName)
      const matchingControl = group.get(matchingConatrolName)

      if (!control || !matchingControl) {
        return { controlNotFound: false }
      }

      const error = control.value === matchingControl.value ? null : { noMatch: true }
      return error
    }
  }
}
