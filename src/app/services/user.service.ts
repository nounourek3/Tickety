import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getWishlist(userId: number): Observable<string[]> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<string[]>(`${this.apiUrl}/${userId}/wishlist`, { headers });
}


  updateWishlist(userId: number, wishlist: string[]): Observable<void> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch<void>(`${this.apiUrl}/${userId}/wishlist`, wishlist, { headers });
}

  
}
