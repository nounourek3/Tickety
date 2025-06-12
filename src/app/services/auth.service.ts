import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { RegisterRequest } from '../interfaces/register-request';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL='http://localhost:8080/api/auth';
private loggedIn$ = new BehaviorSubject<boolean>(false);
private ready$ = new BehaviorSubject<boolean>(false);
  

  constructor(private tokenService: TokenService, private http: HttpClient) {
     const hasToken = this.tokenService.hasToken();
  this.loggedIn$.next(hasToken);
  this.ready$.next(true);
   }
  
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
  this.tokenService.clear();
    this.tokenService.saveUser(user);
    this.loggedIn$.next(true);
}



  logout(): void {
      this.tokenService.clear();
    this.loggedIn$.next(false);
  }

  isLoggedIn(): boolean {
  return this.loggedIn$.value;
}
isReady(): Observable<boolean> {
  return this.ready$.asObservable();
}


   getLoggedInObservable(): Observable<boolean> {
  return this.loggedIn$.asObservable();
}

  getUserId(): number | null {
    const user = this.tokenService.getUser();
    return user ? user.userId : null;
  }
  finalizeGoogleLogin(): void {
  this.http.get<AuthResponse>('http://localhost:8080/api/auth/oauth2/login/success')
    .subscribe({
      next: (res) => this.saveUserSession(res),
      error: (err) => console.error('Login OAuth2 failed', err)
    });
}


}
