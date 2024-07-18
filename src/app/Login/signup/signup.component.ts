import { Component, inject, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Service/user/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule, MatChipsModule,CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  readonly userName = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  readonly confirmPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);

  usersService = inject(UsersService);
  hide = signal(true);
  hidePass = signal(true);

  constructor(private router:Router, private snackBar : MatSnackBar){
    this.signupForm = new FormGroup({
      userName: this.userName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
  }

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  errorMessageConfirmPassword = signal('');

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessageEmail.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessageEmail.set('Not a valid email');
    } else {
      this.errorMessageEmail.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.errorMessagePassword.set('Atleast 8 characters are required');
    } else {
      this.errorMessagePassword.set('');
    }
  }

  updateconfirmPasswordErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.confirmPassword.hasError('minlength')) {
      this.errorMessagePassword.set('Atleast 8 characters are required');
    } else {
      this.errorMessagePassword.set('');
    }
  }

  hideUnhidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  hideUnhideConfirmPassword(event: MouseEvent) {
    this.hidePass.set(!this.hidePass());
    event.stopPropagation();
  }

  signin(){
    this.router.navigate(['signin']);
  }

  signup(){
    if(this.signupForm.valid){
      const user = this.signupForm.value;
      if(user.password == user.confirmPassword){
        this.usersService.addUser(user).subscribe();
        this.snackBar.open('User registered successfully. Please login.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
        this.signin();
      }
      else{
        this.snackBar.open('Password and confirm password must be same.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
      }
    }
  }
}
