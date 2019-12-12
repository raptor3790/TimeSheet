import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-expense-report-list',
  templateUrl: './expense-report-list.component.html',
  styleUrls: ['./expense-report-list.component.scss']
})
export class ExpenseReportListComponent implements OnInit {
  TimesheetStatus = [];
  currentUser; // signed in user
  formIsSubmitted = false;
  isLoading = false;
  espenseReports = []; // Expense Report list for project and signed in user

  constructor(
    private _token: TokenService,
    private _exService: ExpenseService,
    private _sNotify: SnotifyService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._token.setCurrentTitle('Expenses');
    this._token.currentUser.subscribe(user => (this.currentUser = user));
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._exService.getExpenseReportsByUserId(this.currentUser.UserId).subscribe(
      espenseReports => {
        this.espenseReports = espenseReports;
        if ($.fn.DataTable.isDataTable('#list-table')) {
          $('#list-table')
            .DataTable()
            .clear()
            .destroy();
        }
        setTimeout(function() {
          $('#list-table').DataTable({
            paging: true,
            lengthChange: true,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false,
            order: [[0, 'desc']]
          });
          superObj.isLoading = false;
        }, 100);
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  // create expense report for available user
  createExpenseReport() {
    this.isLoading = true;
    // https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
    const data: { [k: string]: any } = {};
    data.UserId = this.currentUser.UserId;
    data.UserName = this.currentUser.UserName;
    this._exService.create(data).subscribe(
      (insertedId) => {
        this.isLoading = false;
        this._router.navigate(['/expense/edit', insertedId]);
      },
      err => {
        console.log(err);
        this._sNotify.error('Failed to create Expense Report!', {
          timeout: 3000
        });
        this.isLoading = false;
      }
    );
  }

  onEdit(expenseReportId) {
    this._router.navigate(['/expense/edit', expenseReportId]);
  }

  // delete expense report
  delete(event, expenseReportId) {
    event.stopPropagation();
    const r = confirm('Confirm Expense Report Deletion');
    if (r) {
      event.stopPropagation();
      this.isLoading = true;
      this._exService.removeExpenseReport(expenseReportId).subscribe(
        () => {
          this.isLoading = false;
          this.loadData();
        },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to delete Expense Report');
        }
      );
    }
  }
}
