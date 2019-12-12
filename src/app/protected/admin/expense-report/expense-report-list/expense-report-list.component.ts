import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseReportNewDialogComponent } from '../expense-report-new/expense-report-new-dialog.component';
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
  currentUser: any;  // signed in user
  formIsSubmitted = false;
  isLoading = false;
  espenseReports = [];  // Expense Report list for project and signed in user

  constructor(private _token: TokenService,
    private _exService: ExpenseService,
    private _modalService: NgbModal,
    private _sNotify: SnotifyService,
    private _router: Router) {
  }

  ngOnInit() {
    this._token.setCurrentTitle('Expenses');
    this._token.currentUser.subscribe(user => this.currentUser = user);
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._exService.getExpenseReportsByOrgId().subscribe(espenseReports => {
      this.espenseReports = espenseReports;
      if ($.fn.DataTable.isDataTable('#expense-report-table')) {
        $('#expense-report-table').DataTable().clear().destroy();
      }
      setTimeout(function () {
        $('#expense-report-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          'order': [[ 0, 'desc' ]]
        });
        superObj.isLoading = false;
      }, 100);
    }, err => {
      this.isLoading = false;
      console.log(err);
    });
  }

  // create expense report for available user
  createExpenseReport() {
    // open new dailog which contains project.
    const modalRef = this._modalService.open(ExpenseReportNewDialogComponent);

    modalRef.componentInstance.emitService.subscribe((data) => {
      modalRef.close();
      this._router.navigate(['/admin/expense/edit', data.UserId, data.insertedId]);
    });
  }

  onEdit(userId, expenseReportId) {
    this._router.navigate(['/admin/expense/edit', userId, expenseReportId]);
  }

  // delete expense report
  delete(event, expenseReportId) {
    event.stopPropagation();
    const r = confirm('Confirm Expense Report Deletion');
    if (r) {
      event.stopPropagation();
      this.isLoading = true;
      this._exService.removeExpenseReport(expenseReportId).subscribe(() => {
        this.isLoading = false;
        this.loadData();
      }, () => {
        this.isLoading = false;
        this._sNotify.error('Failed to delete Expense Report');
      });
    }
  }
}
