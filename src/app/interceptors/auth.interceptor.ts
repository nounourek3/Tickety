import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authEndpoints = ['/api/auth/'];         

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1 · Skip public auth endpoints
    if (this.authEndpoints.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    // 2 · Get user from localStorage
    const user = JSON.parse(localStorage.getItem('tickety-user') || 'null');
    const token = user?.token;
    console.log('➡️ Request to:', req.url);
console.log('🔐 Token added:', token);


    // 3 · If no valid token, continue without auth
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      return next.handle(req);
    }

    // 4 · Attach Authorization header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next.handle(authReq);
  }
}
