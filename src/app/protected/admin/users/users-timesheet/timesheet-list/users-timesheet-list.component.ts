import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { TokenService } from 'src/app/core/services/token.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';

declare let $;

@Component({
  selector: 'app-users-timesheet',
  templateUrl: './users-timesheet-list.component.html',
  styleUrls: ['./users-timesheet-list.component.scss']
})
export class UsersTimesheetsComponent implements OnInit {

  @Input() userId;
  @Input() status;
  OrgId;
  isLoading = false;
  timesheets = [];

  constructor(public _token: TokenService,
    private _tsService: TimesheetService,
    private _router: Router,
    private _sNotify: SnotifyService) {
  }

  ngOnInit() {
    this.OrgId = this._token.getCurrentUser().OrgId;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    if (this.status === 'ALL') {
      this._tsService.getTimesheetsByUserId(this.userId).subscribe(timesheets => {
        this.initTable(timesheets);
      }, () => {
        this.isLoading = false;
        this._sNotify.error('Failed to load submitted timesheets', { timeout: 3000 });
      });
    } else {
      this._tsService.getTimesheetByUidStatus(this.userId, this.status).subscribe(timesheets => {
        this.initTable(timesheets);
      }, () => {
        this.isLoading = false;
        this._sNotify.error('Failed to load submitted timesheets', { timeout: 3000 });
      });
    }

  }

  initTable(timesheets) {
    const superObj = this;
    if ($.fn.DataTable.isDataTable('#timesheet-table')) {
      $('#timesheet-table').DataTable().clear().destroy();
    }
    this.timesheets = timesheets;
    setTimeout(function () {
      $('#timesheet-table').DataTable({
        'paging': true,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        'order': [[ 0, 'desc' ]],
        lengthMenu: [ [5, 10, 25, 50], [5, 10, 25, 50] ],
        pageLength: 5
      });
      superObj.isLoading = false;
      $('#timesheet-table_wrapper').css('margin', '5px');
    }, 100);
  }

  onTimesheetView(userId, timesheetId) {
    if (this._token.isAdmin() || this._token.isSuperAdmin()) {
      this._router.navigate(['/admin/timesheet/edit', userId, timesheetId]);
    } else {
      this._router.navigate(['/timesheet/edit', timesheetId]);
    }
  }
}
