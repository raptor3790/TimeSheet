import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimesheetNewDialogComponent } from '../timesheet-new/timesheet-new-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {

  TimesheetStatus = [];
  currentUser;  // signed in user
  formIsSubmitted = false;
  isLoading = false;
  timesheets = [];  // timesheet list for project and signed in user

  constructor(private _token: TokenService,
    private _tsService: TimesheetService,
    private _modalService: NgbModal,
    private _sNotify: SnotifyService,
    private _router: Router) {
  }

  ngOnInit() {
    this._token.setCurrentTitle('Timesheet');
    this._token.currentUser.subscribe(user => this.currentUser = user);
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._tsService.getTimesheetsByOrgId().subscribe(timesheets => {
      this.timesheets = timesheets;
      $.fn.dataTable.moment('DD/MM/YYYY HH:mm');
      $.fn.dataTable.moment('DD/MM/YYYY');
      if ($.fn.DataTable.isDataTable('#timesheet-table')) {
        $('#timesheet-table').DataTable().clear().destroy();
      }
      setTimeout(function () {
        $('#timesheet-table').DataTable({
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

  // create timesheet for available project
  createTimesheet() {
    // open new dailog which contains project.
    const modalRef = this._modalService.open(TimesheetNewDialogComponent);

    modalRef.componentInstance.emitService.subscribe((data) => {
      modalRef.close();
      this._router.navigate(['/admin/timesheet/edit', data.userId, data.timesheetId]);
    });
  }

  onEdit(userId, timesheetId) {
    this._router.navigate(['/admin/timesheet/edit', userId, timesheetId]);
  }

  // delete timesheets
  delete(event, timesheetId) {
    event.stopPropagation();
    const r = confirm('Confirm Timesheet Deletion');
    if (r) {
      event.stopPropagation();
      this.isLoading = true;
      this._tsService.remove(timesheetId).subscribe(() => {
        this.isLoading = false;
        this.loadData();
      }, () => {
        this.isLoading = false;
        this._sNotify.error('Failed to delete timesheet');
      });
    }
  }
}
