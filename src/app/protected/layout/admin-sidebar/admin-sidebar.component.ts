import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../../core/config';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

declare let $;

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})

export class AdminSidebarComponent implements OnInit, AfterViewInit {

  public loggedIn: boolean;
  public currentUser;

  APP_NAME = Config.APP_NAME;

  constructor(public _router: Router,
    private _auth: AuthService,
    public _token: TokenService) { }

  ngOnInit() {
    this._auth.authStatus.subscribe(value => this.loggedIn = value);
    this._token.currentUser.subscribe(user => this.currentUser = user);
  }

  ngAfterViewInit() {
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.onClickMenu();

    setTimeout(() => {
      this._token.remove();
      this._auth.chageAuthStatus(false);
      this._router.navigateByUrl('/login');
    }, 1000);
  }

  onClickMenu() {
    $('.navbar-toggler').trigger('click');
  }
}
