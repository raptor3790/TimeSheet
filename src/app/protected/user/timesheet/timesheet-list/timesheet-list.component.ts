import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimesheetNewDialogComponent } from '../timesheet-new/timesheet-new-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { SnotifyService } from 'ng-snotify';

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
    this._token.setCurrentTitle('Timesheets');
    this._token.currentUser.subscribe(user => this.currentUser = user);
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._tsService.getTimesheetsByUserId(this.currentUser.UserId).subscribe(timesheets => {
      this.isLoading = false;
      this.timesheets = timesheets;
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
      this._router.navigate(['/timesheet/edit', data.timesheetId]);
    });
  }

  onEdit(timesheetId) {
    // https://angular.io/api/router/NavigationExtras
    this._router.navigate(['/timesheet/edit', timesheetId]);
  }

  // delete timesheets related to project id
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
