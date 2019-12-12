import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/core/services/project.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-subproject-dailog',
  templateUrl: './subproject-dialog.component.html',
  styleUrls: ['./subproject-dialog.component.scss']
})

export class SubProjectDialogComponent implements OnInit {

  @Input() fieldData;
  @Output() emitService = new EventEmitter<any>();

  form: FormGroup;
  formIsSubmitted = false;
  isLoading = false;
  projectStatuses = [];

  constructor(private _fb: FormBuilder,
    private _projectService: ProjectService,
    public activeModal: NgbActiveModal,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    const superObj = this;

    this.form = this._fb.group({
      ProjectId: [this.fieldData.ProjectId],
      SubProjectId: [null],
      SubProjectName: [null, [Validators.required]],
      StartDate: [null, null],
      EndDate: [null, null],
      Budget: [null, [Validators.pattern('^[0-9]+')]],
      Status: ['Active', [Validators.required]]
    });

    $('#StartD').datetimepicker({
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

    $('#StartD').on('dp.change', function (e) { superObj.onStartDateChange(e.target.value); });

    $('#EndD').datetimepicker({
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
    $('#EndD').on('dp.change', function (e) { superObj.onEndDateChange(e.target.value); });

    this.loadData();

    setTimeout(() => {
      $('.selectpicker').selectpicker('render');
    });
  }

  loadData() {
  }

  onStartDateChange(value) {
    this.form.get('StartDate').setValue(value);
  }

  onEndDateChange(value) {
    this.form.get('EndDate').setValue(value);
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onSave() {
    this.formIsSubmitted = true;

    if (this.form.valid) {

      this.isLoading = true;
      const data = this.form.value;
      if (data.StartDate) {
        data.StartDate = this.convertDateToDashString(data.StartDate);
      }

      if (data.EndDate) {
        data.EndDate = this.convertDateToDashString(data.EndDate);
      }

      this._projectService.addSubProject(data).subscribe(() => {
        this.emitService.emit(true);
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this._sNotify.error('Failed to add task', { timeout: 3000 });
        console.log(err);
      });

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

  pad(s) {
    return s < 10 ? '0' + s : s;
  }
}
