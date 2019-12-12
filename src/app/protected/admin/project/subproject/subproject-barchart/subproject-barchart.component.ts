import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import Chart from 'chart.js';

// declare let $;

@Component({
  selector: 'app-subproject-barchart',
  templateUrl: './subproject-barchart.component.html',
  styleUrls: ['./subproject-barchart.component.scss']
})
export class SubProjectBarchartComponent implements OnInit {

  @Output() totalEmit: EventEmitter<any> = new EventEmitter();

  subProjectId;
  isLoading = false;
  prices = [];
  chart = [];

  constructor(private _pjService: ProjectService,
    private _activatedRouter: ActivatedRoute) {

  }

  ngOnInit() {
    this._activatedRouter.params.subscribe(params => {
      this.subProjectId = params['SubProjectId'];
      this.loadData();
    });
  }

  loadData() {
    this.isLoading = true;
    this._pjService.getSubProjectActualPrice(this.subProjectId).subscribe(price => {
      const totalValues = { totalT: 0, totalE: 0 };
      if (price) {
        this.prices = price;
        totalValues.totalT = this.prices['actual_price'];
        totalValues.totalE = this.prices['expense_price'];
        this.chart = new Chart('costchart', {
          type: 'bar',
          data: {
            labels: ['Budget', 'Actual'],
            datasets: [{
              label: 'Budget',
              backgroundColor: '#43a047',
              data: [
                this.prices['budget'],
                0
              ]
            }, {
              label: 'Timesheet',
              backgroundColor: '#00acc1',
              data: [
                0,
                this.prices['actual_price']
              ]
            },
            {
              label: 'Expenses',
              backgroundColor: '#ec407a',
              data: [
                0,
                this.prices['expense_price']
              ]
            }]
          },
          options: {
            scales: {
              xAxes: [{
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            },
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  let label = data.datasets[tooltipItem.datasetIndex].label || '';
                  if (label) {
                    label += ': ';
                  }

                  label += tooltipItem.yLabel.toFixed(2);
                  return label;
                }
              }
            }
          }
        });
        // this.initProBarChart();
      }
      this.isLoading = false;
      this.totalEmit.emit(totalValues);
    }, () => {
      this.isLoading = false;
    });
  }
}
