import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { SnotifyService } from 'ng-snotify';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserTaskService } from 'src/app/core/services/usertask.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';

declare let $;

@Component({
  selector: 'app-timesheet-task-new-dailog',
  templateUrl: './timesheet-task-new-dialog.component.html',
  styleUrls: ['./timesheet-task-new-dialog.component.scss']
})

export class TimesheetTaskNewDialogComponent implements OnInit {

  @Input() userId;
  @Input() timesheetId;
  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  isLoadingProject = false;
  isLoadingTask = false;
  projects = [];
  subProjects = [];
  tasks = [];

  constructor(private _fb: FormBuilder,
    private _pjService: ProjectService,
    private _utService: UserTaskService,
    private _tsService: TimesheetService,
    public activeModal: NgbActiveModal,
    public _token: TokenService,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    this.form = this._fb.group({
      ProjectId: [null, [Validators.required]],
      SubProjectId: [null],
      TaskId: [null, [Validators.required]]
    });
    this.loadData();
  }

  loadData() {
    $('#SubProjectId').selectpicker('render');
    this.isLoadingProject = true;
    this._pjService.getProjectByUserId(this.userId).subscribe(projects => {
      this.isLoadingProject = false;
      this.projects = projects;

      setTimeout(() => {
        $('#ProjectId').selectpicker('render');
      });
    }, () => {
      this.isLoadingProject = false;
    });

    this.isLoadingTask = true;
    this._utService.getUserTasksByUid(this.userId).subscribe(tasks => {
      this.isLoadingTask = false;
      this.tasks = tasks;

      setTimeout(() => {
        $('#TaskId').selectpicker('render');
      });
    }, () => {
      this.isLoadingTask = false;
    });
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onChangeProject() {
    this.isLoadingProject = true;
    this.subProjects = [];
    this._pjService.getSubProjectsByPid(this.form.get('ProjectId').value, 'Active').subscribe(subProjects => {
      this.isLoadingProject = false;
      this.subProjects = subProjects;

      setTimeout(() => {
        $('#SubProjectId').selectpicker('refresh');
      }, 500);
    }, () => {
      this.isLoadingProject = false;
      this._sNotify.error('Failed to create timesheet!', { timeout: 3000 });
    });
  }

  onCreate() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.isLoadingProject = true;
      const data = this.form.value;
      data.TimesheetId = this.timesheetId;
      this._tsService.createTask(data).subscribe(() => {
        this.isLoadingProject = false;
        this.emitService.emit({ success: true });
      }, err => {
        console.log(err);
        this._sNotify.error('Failed to create timesheet!', { timeout: 3000 });
        this.isLoadingProject = false;
      });
    }
  }
}
