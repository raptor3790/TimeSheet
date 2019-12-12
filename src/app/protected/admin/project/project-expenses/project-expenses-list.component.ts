import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { ExpenseService } from 'src/app/core/services/expense.service';

declare let $;

@Component({
  selector: 'app-project-expenses-list',
  templateUrl: './project-expenses-list.component.html',
  styleUrls: ['./project-expenses-list.component.scss']
})
export class ProjectExpensesComponent implements OnInit {

  @Input() type;

  projectId;
  subProjectId;
  isLoading = false;
  expenseReports = [];

  constructor(
    private _exService: ExpenseService,
    private _activatedRouter: ActivatedRoute,
    private _sNotify: SnotifyService
  ) { }

  ngOnInit() {
    this._activatedRouter.params.subscribe(params => {
      if (this.type === 'project') {
        this.projectId = params['ProjectId'];
      } else {
        this.subProjectId = params['SubProjectId'];
      }

      this.loadData();
    });
  }

  loadData() {
    this.isLoading = true;

    if (this.type === 'project') {
      this._exService.getExpenseReportsByPid(this.projectId).subscribe(
        reports => {
          this.expenseReports = reports;

          this.fetchDataTable();
        },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to load Expense of project', {
            timeout: 3000
          });
        }
      );
    } else {
      this._exService.getExpenseReportsBySPid(this.subProjectId).subscribe(
        reports => {
          console.log(reports);
          this.expenseReports = reports;

          this.fetchDataTable();
        },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to load Expense of project', {
            timeout: 3000
          });
        }
      );
    }

  }

  fetchDataTable() {
    const superObj = this;

    $.fn.dataTable.moment('DD/MM/YYYY');
    setTimeout(function () {
      $('#project-expense-table').DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        order: [[2, 'desc']],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        pageLength: 5
      });
      superObj.isLoading = false;
    }, 100);
  }
}
