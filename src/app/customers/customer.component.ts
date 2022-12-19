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
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      rating: [null, acceptableRating(1, 5)],
      sendCatalog: true,
    });
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
}
