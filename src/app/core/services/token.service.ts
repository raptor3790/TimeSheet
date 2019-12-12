import { Injectable } from '@angular/core';
import { Config } from '../config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login: `${Config.API_SERVER_URL}/login`,
    signup: `${Config.API_SERVER_URL}/signup`
  };

  private titleSubject = new BehaviorSubject<string>('');
  currentTitle = this.titleSubject.asObservable();

  private curUserInfo = new BehaviorSubject<any>(this.getCurrentUser());
  currentUser = this.curUserInfo.asObservable();

  constructor() { }

  handle(token, user) {
    this.set(token);
    this.setCurrentUser(user);
  }

  set(token) {
    localStorage.setItem('token', token);
  }

  get() {
    return localStorage.getItem('token');
  }

  setCurrentUser(user: any) {
    this.curUserInfo.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const curUser = localStorage.getItem('user');
    return JSON.parse(curUser);
  }

  setCurrentTitle(title: string) {
    this.titleSubject.next(title);
  }

  remove() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isValid() {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  isAdmin() {
    return (this.getCurrentUser().UserRole === 'Admin');
  }

  isSuperAdmin() {
    return (this.getCurrentUser().UserRole === 'Super');
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }
}
