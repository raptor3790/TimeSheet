import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { TokenService } from 'src/app/core/services/token.service';
import { ExpenseService } from 'src/app/core/services/expense.service';

declare let $;

@Component({
  selector: 'app-users-expense',
  templateUrl: './users-expense-list.component.html',
  styleUrls: ['./users-expense-list.component.scss']
})
export class UsersExpensesComponent implements OnInit {

  @Input() userId;
  OrgId;
  isLoading = false;
  expenseReports = [];

  constructor(private _token: TokenService,
    private _exService: ExpenseService,
    private _router: Router,
    private _sNotify: SnotifyService) {
  }

  ngOnInit() {
    this.OrgId = this._token.getCurrentUser().OrgId;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._exService.getExpenseReportsByUserId(this.userId).subscribe(expenseReports => {
      this.initTable(expenseReports);
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to load submitted timesheets', { timeout: 3000 });
    });
  }

  initTable(expenseReports) {
    const superObj = this;
    if ($.fn.DataTable.isDataTable('#expense-report-table')) {
      $('#expense-report-table').DataTable().clear().destroy();
    }
    this.expenseReports = expenseReports;
    setTimeout(function () {
      $('#expense-report-table').DataTable({
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
      $('#expense-report-table_wrapper').css('margin', '5px');
    }, 100);
  }

  onEdit(userId, expenseReportId) {
    if (this._token.isAdmin() || this._token.isSuperAdmin()) {
      this._router.navigate(['/admin/expense/edit', userId, expenseReportId]);
    } else {
      this._router.navigate(['/expense/edit', expenseReportId]);
    }
  }
}
