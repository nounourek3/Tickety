import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

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
  boardingFileUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VueloService {
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  // 🔄 Get all flights for a specific user
  
getFlightsByUser(userId: number): Observable<Flight[]> {
  return this.http.get<Flight[]>(`${this.apiUrl}/user/${userId}`).pipe(
    tap((flights) => {
      console.log('📦 Flights fetched from backend:', flights);
      flights.forEach(f => console.log(`🪑 Seat for flight ${f.id}: ${f.seat}`));
    })
  );
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
uploadBoardingFile(flightId: number, file: File): Observable<Flight> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.patch<Flight>(`${this.apiUrl}/upload-boarding-file/${flightId}`, formData);
}


}

  

