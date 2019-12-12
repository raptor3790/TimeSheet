import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  canActivate(
  ): Observable<boolean> | Promise<boolean> | boolean {
    const loggedIn = this._token.loggedIn();
    if (loggedIn) {
      if (this._token.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
      } else if (this._token.isSuperAdmin()) {
        this.router.navigate(['/admin/dashboard/super']);
      } else {
        this.router.navigate(['/timesheet']);
      }
    }
    return !loggedIn;
  }

  constructor(private _token: TokenService,
    private router: Router) { }
}
