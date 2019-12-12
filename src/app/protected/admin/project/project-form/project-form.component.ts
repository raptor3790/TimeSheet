import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from 'src/app/core/services/token.service';

declare let $;

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnChanges {

  @Input() formType;
  @Input() data_obs;
  @Output() Submit = new EventEmitter<any>();
  projectStatuses = [];

  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;
  currentUser;
  totalTimesheet = 0;
  totalExpense = 0;
  remaining = 0;

  constructor(
    private _fb: FormBuilder,
    private _token: TokenService
  ) {
    this.currentUser = this._token.getCurrentUser();
  }

  ngOnInit() {
    const superObj = this;
    this.form = this._fb.group({
      ProjectId: [null],
      Status: [null],
      ClientName: [null, null],
      ProjectName: [null, [Validators.required]],
      StartDate: [null, null],
      EndDate: [null, null],
      Budget: [null, [Validators.pattern('^[0-9]+')]]
    });

    $('#StartDate').datetimepicker({
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
    $('#StartDate').on('dp.change', function (e) { superObj.onStartDateChange(e.target.value); });

    $('#EndDate').datetimepicker({
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
    $('#EndDate').on('dp.change', function (e) { superObj.onEndDateChange(e.target.value); });

    setTimeout(() => {
      $('.selectpicker').selectpicker('render');
    });

    this.loadData();
  }

  ngOnChanges() {
    if (this.data_obs) {
      if (this.data_obs.StartDate) {
        this.data_obs.StartDate = this.convertDateToString(this.data_obs.StartDate);
      }

      if (this.data_obs.EndDate) {
        this.data_obs.EndDate = this.convertDateToString(this.data_obs.EndDate);
      }

      setTimeout(() => {
        this.form.patchValue(this.data_obs);
        $('.selectpicker').selectpicker('refresh');
      });
    }
  }

  onStartDateChange(value) {
    this.form.get('StartDate').setValue(value);
  }

  onEndDateChange(value) {
    this.form.get('EndDate').setValue(value);
  }

  loadData() {
    this.isNew = (this.formType === 0);
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onSubmit() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      const formData = JSON.parse(JSON.stringify(this.form.value));
      if (this.form.get('StartDate').value) {
        formData.StartDate = this.convertDateToDashString(this.form.get('StartDate').value);
      }
      if (this.form.get('EndDate').value) {
        formData.EndDate = this.convertDateToDashString(this.form.get('EndDate').value);
      }

      formData.UserId = this.currentUser.UserId;
      this.Submit.emit(formData);
    }
  }

  onTotalValues(data) {
    this.totalTimesheet = data.totalT;
    this.totalExpense = data.totalE;
    this.calcRemaining();
  }

  calcRemaining() {
    const budget = this.form.get('Budget').value ? this.form.get('Budget').value : 0;
    this.remaining = budget - this.totalTimesheet - this.totalExpense;
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

  pad(s) {
    return s < 10 ? '0' + s : s;
  }
}
