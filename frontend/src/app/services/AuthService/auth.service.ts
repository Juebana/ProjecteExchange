import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/login';
  private registerUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      map(response => {
        return new User(username, password, response.token);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.registerUrl, { username, password });
  }
}
