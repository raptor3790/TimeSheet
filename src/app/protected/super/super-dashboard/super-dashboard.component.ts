import { Component, OnInit } from '@angular/core';

import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-super-dashboard',
  templateUrl: './super-dashboard.component.html',
  styleUrls: ['./super-dashboard.component.scss']
})
export class SuperDashboardComponent implements OnInit {

  companies = [];
  trialCompanies = [];
  bronzeCompanies = [];
  silverCompanies = [];
  goldCompanies = [];

  constructor(
    private _tokenService: TokenService
  ) {
    this._tokenService.setCurrentTitle('Dashboard');
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {

  }
}
