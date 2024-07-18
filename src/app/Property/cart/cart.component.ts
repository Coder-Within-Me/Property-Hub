import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropertyForm } from '../../model/PropertyForm';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropertyService } from '../../Service/property.service';
import { CartService } from '../../Service/cart/cart.service';
import { AppConfigService } from '../../Service/config/app-config.service';
import { cart } from '../../model/Cart';
import { MatDialog } from '@angular/material/dialog';
import { DialogBuyOrRentComponent } from '../../common/dialog/dialog-buy-or-rent/dialog-buy-or-rent.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatSelectModule,CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  propertyService= inject(PropertyService);
  cartService = inject(CartService);
  appConfigService = inject(AppConfigService);
  cartData = signal<PropertyForm[]>([]);
  displayedColumns: string[] = ['ownerName', 'contact', 'state', 'city', 'area', 'propertyType', 'bhkType', 'areaSqft', 'transactionType', 'amount','status','action'];
  dataSource: MatTableDataSource<PropertyForm> = new MatTableDataSource<PropertyForm>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private snackBar : MatSnackBar, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getAllProperties();
  }

  getAllProperties(){
    this.propertyService.getProperties().subscribe((properties: PropertyForm[]) => {
      this.cartService.getCartData().subscribe((carts : cart[]) => {
        const propIds = carts.filter(f => f.customerId == this.appConfigService.getUser()).map(z => z.propertyId);
        const propertiesData : PropertyForm[] = properties.filter(x => propIds.includes(x.id ?? 0)).map(x => ({...x, action:false}));
          this.cartData.set(propertiesData);
          this.dataSource.data = this.cartData();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
      });
  }

  removeFromCart(element : PropertyForm){
    // const cart : cart = {
    //   customerId:this.appConfigService.getUser(),
    //   propertyId: element.id as number
    // };
    // this.cartService.deleteCart(cart.customerId,cart.propertyId).subscribe();
    // this.getAllProperties();
    //this.snackBar.open('Successfully removed from cart.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
    this.snackBar.open('Remove from cart : yet to implement.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
  }

  buyOrRentProperty(element : PropertyForm){
    const dialogRef = this.dialog.open(DialogBuyOrRentComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const property : PropertyForm = {...element, status: (result == 'Buy' ? 'Sold' : 'Rented')}
        this.propertyService.updateProperty(property.id ?? 0,property).subscribe(() => {
          this.getAllProperties();
          this.snackBar.open(result == 'Buy' ? 'Bought Successfully.' : 'Rented Successfully.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
      });
      }
    });
  }
}
