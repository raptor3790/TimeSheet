import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting-wrapper',
  templateUrl: './setting-wrapper.component.html',
  styleUrls: ['./setting-wrapper.component.scss']
})
export class SettingWrapperComponent implements OnInit {
  orgId = null;
  currentUser;

  constructor(private _activatedRouter: ActivatedRoute,
    public _token: TokenService) {

    this.currentUser = this._token.getCurrentUser();
    this.orgId = this.currentUser.OrgId;
    if (this.currentUser.UserRole === 'Super') {
      this.orgId = this._activatedRouter.snapshot.params.orgId;
    }
  }

  ngOnInit() {
  }

}
