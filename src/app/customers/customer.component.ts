import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';

import { Customer } from './customer';

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
      firstName: '',
      lastName: '',
      email: '',
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
}
