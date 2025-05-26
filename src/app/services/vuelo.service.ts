import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Flight {
  id: number;
  flightNumber: string;
  bookingCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  flightDate: string;
  flightEmailId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private apiUrl = "http://localhost:8080/api/trips";

  constructor(private http: HttpClient) { }
  getFlightsByUser(userId: number): Observable<Flight[]> {
  return this.http.get<Flight[]>(`${this.apiUrl}/user/${userId}`);
}



  parseFlightEmail(emailId: number): Observable<Partial<Flight>> {
  return this.http.get<Partial<Flight>>(`${this.apiUrl}/parse/${emailId}`);
}

saveFlight(flight: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post(`${this.apiUrl}/flights`, flight, { headers });
}


getEmailsByUser(userId: number): Observable<any[]> {
  const token = localStorage.getItem('token'); // or however you store it
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.get<any[]>(`${this.apiUrl}/emails/user/${userId}`, { headers });
}
getFlights(userId: number) {
  return this.http.get<Flight[]>(`http://localhost:8080/api/trips/flights/user/${userId}`);
}





}
