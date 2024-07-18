import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyForm } from '../model/PropertyForm';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'http://localhost:3000/properties';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<PropertyForm[]> {
    return this.http.get<PropertyForm[]>(this.apiUrl);
  }

  getProperty(id: number): Observable<PropertyForm> {
    return this.http.get<PropertyForm>(`${this.apiUrl}/${id}`);
  }

  addProperty(property: PropertyForm): Observable<PropertyForm> {
    return this.http.post<PropertyForm>(this.apiUrl, property);
  }

  updateProperty(id: number, property: PropertyForm): Observable<PropertyForm> {
    return this.http.put<PropertyForm>(`${this.apiUrl}/${id}`, property);
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
