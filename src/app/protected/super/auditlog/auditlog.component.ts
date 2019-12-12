import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

import { TokenService } from 'src/app/core/services/token.service';

declare let $;

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss']
})
export class AuditLogComponent implements OnInit {

  isLoading = false;
  logs = [];

  companies = [];

  constructor(
    private _userService: UserService,
    private _tokenService: TokenService
  ) {
    this._tokenService.setCurrentTitle('Autid Logs');
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this._userService.getLogs().subscribe(response => {
      this.logs = response;
      $.fn.dataTable.moment('DD/MM/YYYY HH:mm');
      setTimeout(function () {
        $('#log-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          'pageLength': 20,
          'order': [[ 4, 'desc' ]]
        });
        superObj.isLoading = false;
      }, 100);
    }, error => {
      console.log(error);
    });
  }
}
