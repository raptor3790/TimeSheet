import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-super-setting',
  templateUrl: './super-setting.component.html',
  styleUrls: ['./super-setting.component.scss']
})
export class SuperSettingComponent implements OnInit {
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
