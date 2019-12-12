import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  canActivate(): Observable<boolean> {
    const loggedIn = this._token.loggedIn();
    if (loggedIn) {
      return of(true);
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }

  constructor(private _token: TokenService,
    private router: Router) { }
}
