import { Component, inject, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Service/user/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from '../../Service/config/app-config.service';
import { user } from '../../model/user';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,CommonModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  usersService = inject(UsersService);
  appConfigService = inject(AppConfigService);
  hide = signal(true);
  signinForm: FormGroup;
  readonly userName = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  constructor(private router: Router, private snackBar : MatSnackBar){
    this.signinForm = new FormGroup({
      userName: this.userName,
      password: this.password
    });
  }

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.errorMessagePassword.set('Atleast 8 characters are required');
    } else {
      this.errorMessagePassword.set('');
    }
  }

  hideUnhidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  signin(){
    if(this.signinForm.valid){
      const user = this.signinForm.value;
      this.usersService.getUsers().subscribe((users : user[]) =>{
        const verifiedUser : user | undefined = users.find((u : user) => 
          u.userName.toLocaleLowerCase() === user.userName.toLocaleLowerCase() && u.password === user.password
        );

        if(verifiedUser){
          const token = 'Mayur#' + user.userName + '@' + new Date().getTime();
          localStorage.setItem('authToken', token);
          this.appConfigService.setToken(token);
          localStorage.setItem('userDetails', verifiedUser.id + '');
          this.appConfigService.setUser(verifiedUser.id ?? 0);
          this.snackBar.open('Logged in successfully.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
          this.router.navigate(['main']);
        }
        else{
          this.snackBar.open('Username or Password is incorrect.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
        }
      });
    }
  }
}
