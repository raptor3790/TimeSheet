import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
// import { PushService } from 'src/app/core/services/push.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { TimeLineService } from 'src/app/core/services/timeline.service';
import { SnotifyService } from 'ng-snotify';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimesheetTaskNewDialogComponent } from './timesheet-task-new/timesheet-task-new-dialog.component';

@Component({
  selector: 'app-timesheet-edit',
  templateUrl: './timesheet-edit.component.html',
  styleUrls: ['./timesheet-edit.component.scss']
})
export class TimesheetEditComponent implements OnInit {

  currentUser;  // signed in user
  formIsSubmitted = false;
  isLoading = false;
  timesheets = [];  // timesheet list for project and signed in user
  tempTimeseets = null;
  timelines = [];
  timesheetId;
  tax = 0;
  orgStartDate;
  startDate;
  endDate;
  rejectReason = '';
  timesheetStatus;
  notes = '';
  isSameTotalUnit = false;
  tdSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  tdSpacesTotal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  UserType = {
    EMPLOYEE: 'Employee',
    CONTRACTOR: 'Contractor',
    SUBCONTRACTOR: 'Sub-Contractor',
    TEMPORARY: 'Temporary'
  };

  public maskTime = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];
  public weekKeys = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private _token: TokenService,
    private _tsService: TimesheetService,
    private _tlService: TimeLineService,
    private _sNotify: SnotifyService,
    private _activatedRouter: ActivatedRoute,
    // private _pushService: PushService,
    private _modalService: NgbModal) {
  }

  ngOnInit() {
    this._token.currentUser.subscribe(user => this.currentUser = user);
    if (this.currentUser.UserType === this.UserType.EMPLOYEE) {
      this.tdSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      this.tdSpacesTotal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    this._activatedRouter.params.subscribe(params => {
      this.timesheetId = params['timesheetId'];
      this.loadData();
    });
    /* this.projectId = this._activatedRouter.snapshot.params['projectId'];
    this.timesheetId = this._activatedRouter.snapshot.params['timesheetId'];
    this.loadData(); */
  }

  loadData() {
    this.isLoading = true;
    this._tsService.getTimesheet(this.timesheetId).subscribe(timesheet => {
      this.orgStartDate = timesheet.WeekEnding;
      this.tax = timesheet.Tax;
      this.notes = timesheet.Notes;
      this.startDate = timesheet.WeekEnding;
      this.endDate = timesheet.WeekEnding;
      this.timesheetStatus = timesheet.Status;

      if (timesheet.Status === 'Rejected') {
        this.rejectReason = timesheet.RejectedReason;
      }
    });
    // this._tsService.
    this._tsService.getTimesheetsByTid(this.timesheetId).subscribe(timesheets => {
      this.isLoading = false;
      this.timesheets = timesheets;

      if (this.tempTimeseets !== null) {
        for (const tempTs of this.tempTimeseets) {
          for (let j = 0; j < this.timesheets.length; j++) {
            if (tempTs.TimesheetTaskId === this.timesheets[j].TimesheetTaskId) {
              this.timesheets[j] = tempTs;
              continue;
            }
          }
        }
      }

      let unitType;
      if (timesheets.length > 0) {
        this.isSameTotalUnit = true;
        unitType = timesheets[0].UnitTypeName;
        for (const timesheet of timesheets) {
          if (unitType !== timesheet.UnitTypeName) {
            this.isSameTotalUnit = false;
          }
        }
      }
      /* setTimeout(function () {
        $('.input-time').timepicker({
          showInputs: false,
          minuteStep: 1,
          showMeridian: false,
          defaultTime: false
        });
      }, 500); */
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed while loading timesheets');
    });

    this.loadTimeLines();
  }

  loadTimeLines() {
    this._tlService.getByTid(this.timesheetId).subscribe(timelines => {
      this.timelines = timelines;
    });
  }

  onAddTask() {
    // open new dailog which contains project.
    const modalRef = this._modalService.open(TimesheetTaskNewDialogComponent);

    modalRef.componentInstance.userId = this.currentUser.UserId;
    modalRef.componentInstance.timesheetId = this.timesheetId;
    modalRef.componentInstance.emitService.subscribe(() => {
      modalRef.close();
      // https://stackoverflow.com/questions/47776776/how-to-clone-array-of-objects-typescript?rq=1
      this.tempTimeseets = this.timesheets.map(obj => ({ ...obj }));
      this.loadData();
    });
  }

  updateTimesheet() {
    this.isLoading = true;
    for (const timesheet of this.timesheets) {
      timesheet.Total = this.sumOfTask(timesheet, 'price');
    }

    const data = {
      timesheets: this.timesheets,
      total: this.sumOfTotal('price'),
      Notes: this.notes
    };

    this._tsService.update(this.timesheetId, data).subscribe(() => {
      this.isLoading = false;
      this._sNotify.success('Successfully saved.');
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to saved.');
    });
  }

  submitTimesheet() {
    this.isLoading = true;

    const tData = {
      timesheets: this.timesheets,
      total: this.sumOfTotal('price'),
      Notes: this.notes
    };

    this._tsService.update(this.timesheetId, tData).subscribe(() => {
      const data = {
        TimesheetId: this.timesheetId,
        Date: this.endDate,
        Status: 'Submitted',
        UserId: this.currentUser.UserId,
        RejectedReason: ''
      };
      this._tsService.setStatus(data).subscribe(() => {
        this.generatePush();
        this.timesheetStatus = 'Submitted';
        this._sNotify.success('Successfully submitted');
        this.isLoading = false;
        this.loadTimeLines();
      }, () => {
        this._sNotify.error('Failed to submit.');
        this.isLoading = false;
      });
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to shumit.');
    });
  }

  cancelTimesheet() {
    if (confirm('Please confirm if you would like to cancel this timesheet')) {
      this.isLoading = true;
      const data = {
        TimesheetId: this.timesheetId,
        Date: this.endDate,
        Status: 'Cancelled',
        UserId: this.currentUser.UserId,
        RejectedReason: ''
      };
      this._tsService.setStatus(data).subscribe(() => {
        this.timesheetStatus = 'Cancelled';
        this._sNotify.success('Successfully Cancelled');
        this.isLoading = false;
        this.loadTimeLines();
      }, () => {
        this._sNotify.error('Failed to Cancel.');
        this.isLoading = false;
      });
    }
  }

  // Generate Push through an event
  generatePush() {
    /* this._userService.getAdminMessageToken().subscribe(tokens => {
      if (tokens && tokens.length > 0) {
        for (let i = 0; i < tokens.length; i++) {
          this._pushService.generatePush(tokens[i].MessageToken, this.projectName).subscribe(() => {
            console.log('Succesfully Posted');
          }, err => console.log(err));
        }
      }
    }, err => {
      console.log(err);
    }); */
  }

  sumOfTask(timesheet, type) {
    let sum = 0;
    for (let i = 0; i < this.weekKeys.length; i++) {
      if (timesheet[this.weekKeys[i]]) {
        if (type === 'price') {
          if (timesheet.Rate) {
            sum += parseFloat(timesheet[this.weekKeys[i]]) * timesheet.Rate;
          }
        } else {
          sum += parseFloat(timesheet[this.weekKeys[i]]);
        }
      }
    }
    return sum;
  }

  sumOfTotal(type) {
    let sum = 0;
    for (let i = 0; i < this.timesheets.length; i++) {
      sum += this.sumOfTask(this.timesheets[i], type);
    }
    return sum;
  }

  sumOfTax() {
    return this.sumOfTotal('price') * this.tax / 100;
  }

  sumOfPayable() {
    return this.sumOfTotal('price') + this.sumOfTax();
  }

  isDraft() {
    return this.timesheetStatus === 'Draft';
  }

  isCancelled() {
    return this.timesheetStatus === 'Cancelled';
  }

  isRejected() {
    return this.timesheetStatus === 'Rejected';
  }

  isSubmitted() {
    return this.timesheetStatus === 'Submitted';
  }

  isApproved() {
    return this.timesheetStatus === 'Approved';
  }

  isPaid() {
    return this.timesheetStatus === 'Paid';
  }
}
