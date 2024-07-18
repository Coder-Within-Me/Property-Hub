import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../../model/user';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<user[]> {
    return this.http.get<user[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<user> {
    return this.http.get<user>(`${this.apiUrl}/${userId}`);
  }

  addUser(user: user): Observable<user> {
    return this.http.post<user>(this.apiUrl, user);
  }
}
