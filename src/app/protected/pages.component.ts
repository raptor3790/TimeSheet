import { Component, OnInit } from '@angular/core';
import { TokenService } from '../core/services/token.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {

  childRouteRef;

  constructor(public _tokenService: TokenService) { }

  ngOnInit() {
  }

  // https://stackoverflow.com/questions/45720655/access-router-outlet-component-from-parent/45721217
  onActivate(componentRef) {
    this.childRouteRef = componentRef;
  }
}
