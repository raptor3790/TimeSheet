import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { HttpService } from './http.service';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = Config.API_SERVER_URL;

  private loggedIn = new BehaviorSubject<boolean>(this._token.loggedIn());
  authStatus = this.loggedIn.asObservable();

  constructor(private _http: HttpService,
    private _token: TokenService) { }

  chageAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  signup(data) {
    return this._http.post(`${this.baseUrl}/signup`, data);
  }

  login(data) {
    return this._http.post(`${this.baseUrl}/login`, data);
  }

  sendPasswordResetLink(data) {
    return this._http.post(`${this.baseUrl}/sendPasswordResetLink`, data);
  }

  changePassword(data) {
    return this._http.post(`${this.baseUrl}/resetPassword`, data);
  }

  getInformation(data) {
    return this._http.post(`${this.baseUrl}/me`, data, this._token.get());
  }

  checkMembership() {
    return this._http.get(`${this.baseUrl}/user/membership`, this._token.get());
  }
}
