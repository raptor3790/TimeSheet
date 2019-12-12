import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { SnotifyService } from 'ng-snotify';
import * as moment from 'moment';

declare let $;

@Component({
  selector: 'app-timesheet-new-dailog',
  templateUrl: './timesheet-new-dialog.component.html',
  styleUrls: ['./timesheet-new-dialog.component.scss']
})

export class TimesheetNewDialogComponent implements OnInit {

  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  isLoading = false;
  currentUser;

  constructor(private _fb: FormBuilder,
    private _tsService: TimesheetService,
    public activeModal: NgbActiveModal,
    public _token: TokenService,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    const superObj = this;
    this.currentUser = this._token.getCurrentUser();
    this.form = this._fb.group({
      WeekEnding: [null, [Validators.required]]
    });
    this.loadData();

    $('#WeekEnding').datetimepicker({
      useCurrent: false,
      format: 'DD/MM/YYYY',
      daysOfWeekDisabled: [1, 2, 3, 4, 5, 6],
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

    $('#WeekEnding').on('dp.change', function(e) {
      const value = e.target.value;
      const lastDate = moment(value, 'DD/MM/YYYY').day(0).format('DD/MM/YYYY');
      const firstDate =  moment(value, 'DD/MM/YYYY').day(-6).format('DD/MM/YYYY');
      $('#Week').val(firstDate + ' - ' + lastDate);
      superObj.form.get('WeekEnding').setValue(value);
    });
  }

  loadData() {
  }

  onPickDate() {
    $('#WeekEnding').datetimepicker('show');
  }

  onDateChange(value) {
    console.log(value);
    const lastDate = moment(value, 'DD/MM/YYYY').day(0).format('DD/MM/YYYY');
    const firstDate =  moment(value, 'DD/MM/YYYY').day(-6).format('DD/MM/YYYY');
    $('#Week').val(firstDate + ' - ' + lastDate);
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onCreateTimesheet() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.isLoading = true;

      const data = this.form.value;
      data.WeekEnding = data.WeekEnding;

      this._tsService.create(this.currentUser.UserId, data).subscribe((timesheetId) => {
        this.isLoading = false;
        this.emitService.emit({userId: data.UserId, timesheetId: timesheetId});
      }, err => {
        console.log(err);
        this._sNotify.error('Failed to create timesheet!', { timeout: 3000 });
        this.isLoading = false;
      });
    }
  }
}
