import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { SnotifyService } from 'ng-snotify';
import { TokenService } from '../../../../core/services/token.service';

declare let $;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() orgId;

  dt: any = [];
  dt_loading: boolean;

  constructor(private _userService: UserService,
    private _sNotify: SnotifyService,
    public _token: TokenService) { }

  ngOnInit() {
    this._token.setCurrentTitle('Users');
    this.getData();
  }

  getData() {
    const superObj = this;
    this.dt_loading = true;

    this._userService.getAllByOrgId(this.orgId).subscribe((response) => {
      this.dt = response;
      if ($.fn.DataTable.isDataTable('#user-table')) {
        $('#user-table').DataTable().clear().destroy();
      }
      setTimeout(function () {
        $('#user-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false
        });
        superObj.dt_loading = false;
      }, 100);
    },
      () => {
        this.dt_loading = false;
      });
  }


  delete(event, id) {
    event.stopPropagation();
    const r = confirm('Confirm User Deletion');
    if (r) {
      this.dt_loading = true;
      this._userService.remove(id).subscribe(() => {
        this.getData();
        this.dt_loading = false;
      },
        () => {
          this._sNotify.error('Failed to delete User');
          this.dt_loading = false;
        });
    }
  }

}
