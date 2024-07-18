import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../Service/property.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PropertyForm } from '../../model/PropertyForm';

@Component({
  selector: 'app-register-property',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatOptionModule,
  CommonModule],
  templateUrl: './register-property.component.html',
  styleUrl: './register-property.component.css'
})
export class RegisterPropertyComponent {

  propertyService = inject(PropertyService);

  propertyForm: FormGroup;
  bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Twin Bungalow'];

  constructor(private formBuilder: FormBuilder, private snackBar : MatSnackBar) {
    this.propertyForm = this.formBuilder.group({
      ownerName: ['', Validators.required],
      contact:['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required],
      propertyType: ['', Validators.required],
      bhkType: [''],
      areaSqft: ['', Validators.required],
      transactionType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const formValue: PropertyForm = this.propertyForm.value;
      this.propertyService.addProperty(formValue).subscribe();
      this.snackBar.open('Property Registered Successfully.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
      this.propertyForm.reset();
    }
  }
}
