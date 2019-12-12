import { Component, OnInit, Input } from '@angular/core';
import { SettingService } from 'src/app/core/services/setting.service';
import { TokenService } from 'src/app/core/services/token.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  @Input() orgId;
  isLoading = false;
  memberships = [];
  company;
  currentUser;

  constructor(private _settingService: SettingService,
    public _token: TokenService,
    private _sNotify: SnotifyService) {

    this._token.setCurrentTitle('Settings');
    this.currentUser = this._token.getCurrentUser();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this._settingService.getCompanyById(this.orgId).subscribe(response => {
      this.isLoading = false;
      this.company = response;
    }, err => {
      this.isLoading = false;
      console.log(err);
    });
  }

  onSubmit() {
    this.isLoading = true;
    this._settingService.updateCompany(this.orgId, { Membership: this.company.Membership }).subscribe(() => {
      this.isLoading = false;
      this._sNotify.success('Successfully updated');
    }, () => {
      this.isLoading = false;
      this._sNotify.success('Failed to update');
    });
  }
}
