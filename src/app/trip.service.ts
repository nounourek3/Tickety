import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip } from './trip';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl='http://localhost:8080/api/trips/user';

  constructor(private http: HttpClient) { }
  getTripsByUserId(userId: number): Observable<Trip[]>{
    return this.http.get<Trip[]>(`${this.apiUrl}/${userId}`);

  }
}
