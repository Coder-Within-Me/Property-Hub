import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PropertyService } from '../../Service/property.service';
import {MatDividerModule} from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropertyForm } from '../../model/PropertyForm';
import { CartService } from '../../Service/cart/cart.service';
import { cart } from '../../model/Cart';
import { AppConfigService } from '../../Service/config/app-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterForm } from '../../model/FilterForm';
import { MatDialog } from '@angular/material/dialog';
import { DialogBuyOrRentComponent } from '../../common/dialog/dialog-buy-or-rent/dialog-buy-or-rent.component';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatSelectModule,CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './property-listing.component.html',
  styleUrl: './property-listing.component.css'
})
export class PropertyListingComponent implements OnInit{

  propertyService= inject(PropertyService);
  cartService= inject(CartService);
  appConfigService = inject(AppConfigService);
  filterForm: FormGroup;
  propertiesData = signal<PropertyForm[]>([]);
  computedProperties = signal<PropertyForm[]>([]);
  states = signal<string[]>([]);
  cities = signal<string[]>([]);
  areas = signal<string[]>([]);
  bhks = signal<string[]>([]);
  bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Twin Bungalow'];

  displayedColumns: string[] = ['ownerName', 'contact', 'state', 'city', 'area', 'propertyType', 'bhkType', 'areaSqft', 'transactionType', 'amount','status','action'];
  dataSource: MatTableDataSource<PropertyForm> = new MatTableDataSource<PropertyForm>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private snackBar : MatSnackBar, public dialog: MatDialog) {
    this.filterForm = this.formBuilder.group({
      state: [''],
      city: [''],
      area: [''],
      propertyType: [''],
      bhkType: [''],
      transactionType: [''],
      minAmount: [null],
      maxAmount: [null]
    });
  }

  ngOnInit(): void {
    this.getAllProperties();
  }

  getAllProperties(){
    this.propertyService.getProperties().subscribe((properties: PropertyForm[]) => {
      this.propertiesData.set(properties);
      const data = this.propertiesData();
        this.updatePropertyList(data);
      });
  }

  getUniqueArray(array: any[]): any[] {
    return Array.from(new Set(array));
  }

  filter() {
    if (this.filterForm.valid) {
      const filtervalues: FilterForm = this.filterForm.value;
      if(Object.values(filtervalues).every(val => val == '' || val == null)){
        this.dataSource.data = this.propertiesData();
      }
      else{
      let filteredData = this.propertiesData();

      if ((filtervalues.minAmount !== null  && filtervalues.minAmount > -1) || (filtervalues.maxAmount !== null  && filtervalues.maxAmount > -1)) {
        
        filteredData = filteredData.filter((f: PropertyForm) =>{
          return (((filtervalues.minAmount !== null  && filtervalues.minAmount > -1) && (filtervalues.maxAmount !== null  && filtervalues.maxAmount > -1)) ? (f.amount >= filtervalues.minAmount && f.amount <= filtervalues.maxAmount) :
          ((filtervalues.minAmount !== null  && filtervalues.minAmount > -1)  ? (f.amount >= filtervalues.minAmount) : (f.amount <= filtervalues.maxAmount)));
        });
      }
      Object.keys(filtervalues).forEach(key => {
        const filterValue = filtervalues[key as keyof FilterForm];
        if (filterValue !== null && filterValue !== '' && key !== 'minAmount' && key !== 'maxAmount') {
          console.log(filteredData);
          filteredData = filteredData.filter((f: PropertyForm) => {
            const propertyValue = f[key as keyof PropertyForm];
            return propertyValue == filterValue;
          });
        }
      });
      this.updatePropertyList(filteredData);
      };  
    }
  }

  updatePropertyList(data : PropertyForm[]){
    this.cartService.getCartData().subscribe((carts : cart[]) => {
      const propIds = carts.filter(f => f.customerId == this.appConfigService.getUser()).map(z => z.propertyId);
      data.forEach((x : PropertyForm) => {
        x.action = propIds.includes(x.id ?? 0);
      });
      this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.states.set(this.getUniqueArray(data.map(p => p.state)));
        this.cities.set(this.getUniqueArray(data.map(p => p.city)));
        this.areas.set(this.getUniqueArray(data.map(p => p.area)));
    });
  }

  clearFilters(){
    this.filterForm.reset();
    this.dataSource.data = this.propertiesData();
    this.states.set(this.getUniqueArray(this.propertiesData().map(p => p.state)));
        this.cities.set(this.getUniqueArray(this.propertiesData().map(p => p.city)));
        this.areas.set(this.getUniqueArray(this.propertiesData().map(p => p.area)));
  }

  buyOrRentProperty(element : PropertyForm){
    const dialogRef = this.dialog.open(DialogBuyOrRentComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const property : PropertyForm = {...element, status: (result == 'Buy' ? 'Sold' : 'Rented')}
        this.propertyService.updateProperty(property.id ?? 0,property).subscribe(() => {
          this.getAllProperties();
          this.snackBar.open(result == 'Buy' ? 'Bought Successfully.' : 'Rented Successfully.','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
          this.clearFilters();
      });
      }
    });
  }
  
  addToCart(element : PropertyForm){
    const cart : cart = {
      customerId:this.appConfigService.getUser(),
      propertyId: element.id as number
    };
    this.cartService.addToCart(cart).subscribe();
    this.getAllProperties();
    this.clearFilters();
    this.snackBar.open('Successfully added to cart .','Ok',{ horizontalPosition : 'center', verticalPosition : 'top', duration : 3000});
  }
}
