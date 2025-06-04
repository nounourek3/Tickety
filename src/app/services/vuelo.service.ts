import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Flight {
  id?: number; // Optional for new flights
  flightNumber: string;
  bookingCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  flightDate: string; // Format: 'yyyy-MM-dd'
  userId: number;
  airline?: string;
  seat?: string;
  pdfFileName?: string;
  durationHours?: number;
  showDetails?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  // 🔄 Get all flights for a specific user
  getFlightsByUser(userId: number): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 🆕 Save a new flight
  saveFlight(flight: Flight): Observable<any> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(this.apiUrl, flight, { headers });
  }
 deleteFlight(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
updateFlight(id: number, flight: Flight): Observable<Flight> {
  return this.http.put<Flight>(`http://localhost:8080/api/flights/${id}`, flight);
}


}

  

