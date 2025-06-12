import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
private readonly KEY = 'tickety-user';

  saveUser(user: { email: string; userId: number; token: string }) {
    if(typeof window !== 'undefined' && localStorage){
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }
}

  getUser() {
    if(typeof window !== 'undefined' && localStorage){
    const data = localStorage.getItem('tickety-user');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

  getToken(): string | null {
    const user = this.getUser();
    return user ? user.token : null;
  }

  clear(): void {
    localStorage.removeItem(this.KEY);
  }
  hasToken(): boolean {
  return !!this.getToken();
}

}


