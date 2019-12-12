import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  static NotMatchPassword(AC: AbstractControl) {
    const password = AC.get('Password').value; // to get value in input tag
    const confirmPassword = AC.get('Password_confirmation').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('Password_confirmation').setErrors({ NotMatchPassword: true });
    } else {
      return null;
    }
  }
}
