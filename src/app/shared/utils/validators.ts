import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { email: true };
    };
  }

  static minPrice(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value >= min ? null : { minPrice: { min, actual: control.value } };
    };
  }
}
