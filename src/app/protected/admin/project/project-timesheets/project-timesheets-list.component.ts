import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { TimesheetService } from 'src/app/core/services/timesheet.service';

declare let $;

@Component({
  selector: 'app-project-timesheets-list',
  templateUrl: './project-timesheets-list.component.html',
  styleUrls: ['./project-timesheets-list.component.scss']
})
export class ProjectTimesheetsComponent implements OnInit {

  @Input() type;
  projectId;
  subProjectId;
  isLoading = false;
  timesheets = [];

  constructor(
    private _tsService: TimesheetService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
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
      this._tsService.getTimesheetsForProject(this.projectId).subscribe(
        timesheets => {
          this.timesheets = timesheets;

          this.fetchDataTable();
        },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to load timesheets of project', {
            timeout: 3000
          });
        }
      );
    } else {
      this._tsService.getTimesheetsForSubProject(this.subProjectId).subscribe(
        timesheets => {
          this.timesheets = timesheets;

          this.fetchDataTable();
        },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to load timesheets of project', {
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
      $('#project-timesheet-table').DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        order: [[3, 'desc']],
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        pageLength: 5
      });
      superObj.isLoading = false;
      $('#project-timesheet-table_wrapper').css('margin', '5px');
    }, 100);
  }

  onTimesheetView(userId, timesheetId) {
    this._router.navigate(['/admin/timesheet/edit', userId, timesheetId]);
  }
}
