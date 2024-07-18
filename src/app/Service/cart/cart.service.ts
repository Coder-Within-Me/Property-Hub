import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cart } from '../../model/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  getCartData(): Observable<cart[]> {
    return this.http.get<cart[]>(this.apiUrl);
  }

  addToCart(cart: cart): Observable<cart> {
    return this.http.post<cart>(this.apiUrl, cart);
  }

  deleteCart(customerId: string | null,propertyId : number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}` + '?customerId=' + `${customerId}` + '&propertyId=' + `${customerId}`);
  }
}
