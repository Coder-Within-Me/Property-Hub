import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-dialog-buy-or-rent',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule],
  templateUrl: './dialog-buy-or-rent.component.html',
  styleUrl: './dialog-buy-or-rent.component.css'
})
export class DialogBuyOrRentComponent {
  selected: string = '';
  options: string[] = ['Buy', 'Rent'];

  constructor(public dialogRef: MatDialogRef<DialogBuyOrRentComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(this.selected);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
