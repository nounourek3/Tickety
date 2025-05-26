import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { RegisterRequest } from '../interfaces/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL='http://localhost:8080/api/auth';

  constructor(private tokenService: TokenService, private http: HttpClient) { }
  
login(email: string, password: string) {
  return this.http.post<any>(
    'http://localhost:8080/api/auth/login',
    { email, password },
    {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'  // ✅ make sure it's JSON, not 'text'
    }
  );
}


register(data: RegisterRequest) {
  return this.http.post<any>('http://localhost:8080/api/auth/register', data).pipe(
    
  );
}
saveUserSession(user: { email: string; userId: number; token: string }) {
  this.tokenService.clear(); // 🔐 remove old user
  this.tokenService.saveUser(user); // 💾 save new user
}



  logout(): void {
    this.tokenService.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserId(): number | null {
    const user = this.tokenService.getUser();
    return user ? user.userId : null;
  }
}
