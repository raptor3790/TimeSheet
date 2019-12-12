import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from 'src/app/core/services/report.service';

import { TokenService } from 'src/app/core/services/token.service';

declare let $;

@Component({
  selector: 'app-report-month',
  templateUrl: './report-month.component.html',
  styleUrls: ['./report-month.component.scss']
})
export class ReportMonthComponent implements OnInit {
  form: FormGroup;
  formIsSubmitted = false;
  isLoadingProject = false;
  paids = [];
  chart: any;
  startDate = null;
  endDate = null;

  constructor(
    private _reportService: ReportService,
    private _fb: FormBuilder,
    private _tokenService: TokenService
  ) { }

  ngOnInit() {
    this._tokenService.setCurrentTitle('Monthly Timesheet Costs');

    const superObj = this;
    this.form = this._fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    });

    $('.datepicker').datetimepicker({
      format: 'DD/MM/YYYY',
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
      }
    });

    $('#startDate').on('dp.change', function (e) {
      superObj.form.get('startDate').setValue(e.target.value);
      $(e.target).closest('.form-group').addClass('is-filled');
      if (e.target.value) {
        superObj.startDate = this.convertDateToDashString(e.target.value);
      } else {
        superObj.startDate = null;
      }
    });

    $('#endDate').on('dp.change', function (e) {
      superObj.form.get('endDate').setValue(e.target.value);
      $(e.target).closest('.form-group').addClass('is-filled');

      if (e.target.value) {
        superObj.endDate = this.convertDateToDashString(e.target.value);
      } else {
        superObj.endDate = null;
      }
    });

    this.loadData();
  }

  loadData() {
    this.isLoadingProject = true;
    this._reportService
      .getReportsByMonth({ startDate: this.startDate, endDate: this.endDate })
      .subscribe(
        res => {
          this.paids = res;
          this.paids = this.paids.map((item) => {
            item.MonthEnding = this.convertDateToYMString(item.MonthEnding);
            return item;
          });

          this.initBarChart();
          this.initTable();
          this.isLoadingProject = false;
        },
        err => {
          console.log(err);
        }
      );
  }

  initBarChart() {
    const superObj = this;
    const data = [];
    const projectNames = [];
    for (let i = 0; i < this.paids.length; i++) {
      data.push(this.paids[i].TotalCost);
      projectNames.push(this.paids[i].MonthEnding);
    }

    const barChartData = {
      labels: projectNames,
      datasets: [
        {
          label: 'Total',
          borderColor: '#00a65a',
          fill: true,
          backgroundColor: '#00a65a88',
          data: data
        }
      ]
    };
    if (this.chart) {
      $('#barChart').remove();
      $('.chart').append('<canvas id="barChart" style="height:50vh"></canvas>');
    }
    setTimeout(function () {
      superObj.chart = new Chart('barChart', {
        type: 'line',
        data: barChartData,
        options: {
          responsive: true,
          legend: false,
          xAxes: [
            {
              ticks: {
                autoSkip: false
              }
            }
          ],
          tooltips: {
            callbacks: {
              label: function (tooltipItem) {
                return 'Total :' + tooltipItem.yLabel.toFixed(2);
              }
            }
          } /* ,  disable curve line
          elements: {
            line: {
                tension: 0, // disables bezier curves
            }
          }*/
        }
      });
    }, 100);
  }

  initTable() {
    $.fn.dataTable.moment('MMM-YYYY');
    if ($.fn.DataTable.isDataTable('#report-table')) {
      $('#report-table').DataTable().clear().destroy();
    }
    setTimeout(function () {
      $('#report-table').DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        order: [[0, 'asc']]
      });
      $('#report-table_wrapper').css('margin', '5px');
    }, 100);
  }

  isInvalidField(field: string) {
    return (
      !this.form.get(field).valid &&
      (this.form.get(field).touched || this.formIsSubmitted)
    );
  }

  onSubmit(event) {
    event.preventDefault();
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.loadData();
    }
  }

  convertDateToString(inputFormat, split = '/') {
    const d = new Date(inputFormat);
    return [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join(split);
  }

  convertDateToDashString(inputDate) {
    const arr = inputDate.split('/');
    if (arr.length > 0) {
      return [arr[2], arr[1], arr[0]].join('-');
    }
    return undefined;
  }

  convertDateToYMString(inputDate) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    const d = new Date(inputDate);
    return [monthNames[d.getMonth()], this.pad(d.getFullYear())].join('-');
  }

  pad(s) {
    return s < 10 ? '0' + s : s;
  }
}
