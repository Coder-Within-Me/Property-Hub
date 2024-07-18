import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule,MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private router : Router,private snackBar : MatSnackBar){
  }

  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    this.snackBar.open('Logged off successfully.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
    this.router.navigate(['signin']);
  }
}
