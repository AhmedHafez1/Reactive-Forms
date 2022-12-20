import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Customer } from './customer';

interface ValidationData {
  controlName: string;
  minlength?: number;
  maxlength?: number;
}
const getValidationMessages = (
  validationData: ValidationData
): Record<string, string> => {
  return {
    required: `Please enter the ${validationData.controlName} `,
    email: 'Please enter a valid email address ',
    minlength: `The ${validationData.controlName} must be longer than ${validationData.minlength} `,
    maxlength: `The ${validationData.controlName} must be less than ${validationData.maxlength} `,
    notMatchEmail: `Email and Confirm Email don't match `,
  };
};

const acceptableRating = (min: number, max: number): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      c.value !== null &&
      (c.value < min || c.value > max || isNaN(c.value))
    ) {
      return { range: true };
    }
    return null;
  };
};

const emailMatcher = (
  c: AbstractControl
): { [key: string]: boolean } | null => {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');
  if (emailControl?.pristine || confirmEmailControl?.pristine) return null;
  if (emailControl?.value !== confirmEmailControl?.value)
    return { notMatchEmail: true };
  return null;
};
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(15)]],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]],
        },
        { validator: emailMatcher }
      ),

      phone: '',
      notification: 'email',
      rating: [null, acceptableRating(1, 5)],
      sendCatalog: true,
    });

    this.customerForm
      .get('notification')
      ?.valueChanges.subscribe((value) => this.setPhoneValidation(value));
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  supplyData(): void {
    this.customerForm.patchValue({
      firstName: 'Mariam',
      lastName: 'Ahmed',
      email: 'Mariam@Ah.com',
    });
  }

  setPhoneValidation(notificationType: string) {
    const phoneControl = this.customerForm.get('phone');

    if (notificationType === 'text') {
      phoneControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    } else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }

  getErrorMessages(validationData: ValidationData) {
    const cNames = validationData.controlName.split('.');
    const control = this.customerForm.get(validationData.controlName);
    console.log(validationData.controlName, control);
    let errorMessages: string = '';
    if (control?.errors && (control.dirty || control.touched))
      errorMessages = Object.keys(control.errors)
        .map(
          (key) =>
            getValidationMessages({
              ...validationData,
              controlName: cNames[cNames.length - 1],
            })?.[key]
        )
        .join(', ');

    return errorMessages;
  }
}
