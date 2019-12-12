import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { TokenService } from 'src/app/core/services/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-subproject-edit',
  templateUrl: './subproject-edit.component.html',
  styleUrls: ['./subproject-edit.component.scss']
})
export class SubProjectEditComponent implements OnInit {

  projectStatuses = [];
  message: string;
  subProjectId = null;
  subProject = null;
  projectId = null;
  form: FormGroup;

  totalTimesheet = 0;
  totalExpense = 0;
  remaining = 0;

  submitted = false;
  success = true;
  loading = false;

  constructor(private _fb: FormBuilder,
    private _activateRoute: ActivatedRoute,
    private _projectService: ProjectService,
    private _tokenService: TokenService,
    private _sNotify: SnotifyService) {

    this.projectId = this._activateRoute.snapshot.params.ProjectId;
    this.subProjectId = this._activateRoute.snapshot.params.SubProjectId;

    this.form = this._fb.group({
      SubProjectId: [null, [Validators.required]],
      SubProjectName: [null, [Validators.required]],
      StartDate: [null, null],
      EndDate: [null, null],
      Budget: [null, [Validators.pattern('^[0-9]+')]],
      Status: [null, Validators.required]
    });
  }

  ngOnInit() {
    const superObj = this;

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

    this.loading = true;

    this._tokenService.setCurrentTitle('Edit Sub Project');

    this._projectService.getSubProjetById(this.subProjectId).subscribe((subProject) => {
      if (subProject.StartDate) {
        subProject.StartDate = this.convertDateToString(subProject.StartDate);
      }

      if (subProject.EndDate) {
        subProject.EndDate = this.convertDateToString(subProject.EndDate);
      }

      this.subProject = subProject;
      this.form.patchValue(subProject);

      setTimeout(() => {
        $('.selectpicker').selectpicker('render');
        $('.selectpicker').selectpicker('refresh');
      });

      this.loading = false;
    }, () => {
      this._sNotify.error('Error occured while get sub project information', { timeout: 3000 });
      this.loading = false;
    });

  }

  onStartDateChange(value) {
    this.form.get('StartDate').setValue(value);
  }

  onEndDateChange(value) {
    this.form.get('EndDate').setValue(value);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const data = this.form.value;
      if (data.StartDate) {
        data.StartDate = this.convertDateToDashString(data.StartDate);
      }

      if (data.EndDate) {
        data.EndDate = this.convertDateToDashString(data.EndDate);
      }

      this.loading = true;
      this._projectService.updateSubProject(data).subscribe(() => {
        this.success = true;
        this.message = 'Successfully saved';

        this.loading = false;
      },
        () => {
          this.success = false;
          this.message = 'Error occured while save Project';

          this.loading = false;
        }
      );
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

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.submitted))
    );
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
