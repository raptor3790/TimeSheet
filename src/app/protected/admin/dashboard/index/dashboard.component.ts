import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ExpenseService } from 'src/app/core/services/expense.service';

import { TokenService } from 'src/app/core/services/token.service';

declare let $;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoadingProject = false;
  isLoadingTimesheet = false;
  isLoadingExpense = false;
  isLoadingExpenseP = false;
  activeProjects = [];
  timesheets = [];
  ts_approved = [];
  ts_paid = [];
  ts_rejected = [];
  projects = [];
  paids = [];
  expenseProjects = [];
  expenses = [];
  chart = [];

  constructor(
    private _projectService: ProjectService,
    private _timesheetService: TimesheetService,
    private _exService: ExpenseService,
    private _tokenService: TokenService,
  ) { }

  ngOnInit() {
    this._tokenService.setCurrentTitle('Dashboard');
    this.loadData();
  }

  loadData() {
    this.isLoadingProject = true;
    this._projectService.getAll('Budget').subscribe(
      response => {
        this.projects = response;
        this.activeProjects = response.filter(
          p => p.Status === 'Active'
        );
        this._projectService.getPaidTotals().subscribe(
          res => {
            this.paids = res;
            this.isLoadingExpenseP = true;
            this._exService.getExpensesProject().subscribe(
              expenses => {
                this.isLoadingExpenseP = false;
                this.expenseProjects = expenses;
                this.initBarChart();
              },
              () => {
                this.isLoadingExpense = false;
              }
            );
          },
          err => {
            console.log(err);
          }
        );
        this.initDataTable('project-table', 0);
        this.isLoadingProject = false;
      },
      error => {
        this.isLoadingProject = false;
        console.log(error);
      }
    );

    this.isLoadingTimesheet = true;
    setTimeout(() => {
      this._timesheetService.getTimesheetsByOrgId().subscribe(
        response => {
          this.timesheets = response;
          this.ts_approved = this.timesheets.filter(
            ts => ts.Status === 'Submitted'
          );
          this.initDataTable('approv-table', 1);

          this.ts_paid = this.timesheets.filter(
            ts => ts.Status === 'Approved'
          );
          this.initDataTable('paid-table', 1);

          this.ts_rejected = this.timesheets.filter(
            ts => ts.Status === 'Rejected'
          );
          this.initDataTable('reject-table', 2);

          this.isLoadingTimesheet = false;
        },
        error => {
          console.log(error);
          this.isLoadingTimesheet = false;
        }
      );
    }, 100);


    this.isLoadingExpense = true;

    setTimeout(() => {
      this._exService.getExpenseReportsSubmitted().subscribe(
        expenses => {
          this.isLoadingExpense = false;
          this.expenses = expenses;
        },
        error => {
          this.isLoadingExpense = false;
          console.log(error);
        }
      );
    }, 200);

  }

  initDataTable(tableId, sortField) {
    $.fn.dataTable.moment('DD/MM/YYYY HH:mm');
    $.fn.dataTable.moment('DD/MM/YYYY');
    setTimeout(function () {
      $('#' + tableId).DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        order: [[sortField, 'asc']],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        pageLength: 5
      });
      $('#timesheet-table_wrapper').css('margin', '5px');
    }, 100);
  }

  initBarChart() {
    const data1 = [];
    const data2 = [];
    const data3 = [];
    const projectNames = [];
    const paidsArray = {};
    const epArray = {};

    for (let i = 0; i < this.paids.length; i++) {
      paidsArray[this.paids[i].ProjectId] = this.paids[i].Total;
    }

    for (let i = 0; i < this.expenseProjects.length; i++) {
      epArray[this.expenseProjects[i].ProjectId] = this.expenseProjects[i].Total;
    }

    for (let i = 0; i < this.activeProjects.length; i++) {
      if (data1.length > 4) {
        break;
      }
      data1.push(this.activeProjects[i].Budget);
      let paidTotal = 0;
      if (this.activeProjects[i].ProjectId in paidsArray) {
        paidTotal = paidsArray[this.activeProjects[i].ProjectId];
      }
      if (paidTotal === 0) {
        paidTotal = null;
      }
      data2.push(paidTotal);

      let epTotal = 0;
      if (this.activeProjects[i].ProjectId in epArray) {
        epTotal = epArray[this.activeProjects[i].ProjectId];
      }
      if (epTotal === 0) {
        epTotal = null;
      }
      data3.push(epTotal);

      let projectName = this.activeProjects[i].ProjectName;
      if (projectName.length > 9) {
        projectName = projectName.substring(0, 10) + '...';
      }
      projectNames.push(projectName);
    }

    const barChartData = {
      labels: projectNames,
      datasets: [
        {
          label: 'Budget',
          backgroundColor: '#43a047',
          data: data1,
          stack: 1
        },
        {
          label: 'Timesheets',
          backgroundColor: '#00acc1',
          data: data2,
          stack: 2
        },
        {
          label: 'Expenses',
          backgroundColor: '#ec407a',
          data: data3,
          stack: 2
        }
      ]
    };

    this.chart = new Chart('barChart', {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
        legend: {
          position: 'top'
        },
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        xAxes: [
          {
            ticks: {
              autoSkip: false
            }
          }
        ]
      }
    });
  }

  projectStatusColor(status) {
    if (status === 'Active') {
      return ['label-success'];
    }
  }
}
