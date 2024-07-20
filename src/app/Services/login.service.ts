import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Token } from '../Models/Token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  apiUrl: string = 'http://localhost:5005/api/account/login';
  tokenKey: string = 'auth-token';

  login(username: string, password: string): Observable<string> {
    const body = { userName: username, password: password };
  
    return this.http.post(`${this.apiUrl}`, body, { responseType: 'text' }).pipe(
      tap((obj) => {
        let key:Token = JSON.parse(obj);
        sessionStorage.setItem(this.tokenKey, key.token);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        sessionStorage.removeItem(this.tokenKey);
        return of(''); 
      })
    );
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}