import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public _token: TokenService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;

    const currentUser = this._token.getCurrentUser();
    let userRole = '';
    if (currentUser) {
      userRole = this._token.getCurrentUser().UserRole;
    } else {
      return false;
    }

    if (!expectedRole.includes(userRole)) {
      if (userRole === 'Basic') {
        this.router.navigate(['/timesheet']);
      } else if (userRole === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'Super') {
        this.router.navigate(['/super/dashboard']);
      }

      return false;
    }

    return true;
  }
}
