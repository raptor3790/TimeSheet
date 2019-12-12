import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserTaskService } from 'src/app/core/services/usertask.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-task-dailog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})

export class TaskDialogComponent implements OnInit {

  @Input() openType;
  @Input() fieldData;
  @Output() emitService = new EventEmitter<any>();

  form: FormGroup;
  formIsSubmitted = false;
  isLoading = false;
  userList = [];
  unitTypes = [];

  constructor(private _fb: FormBuilder,
    private _projectService: ProjectService,
    private _utService: UserTaskService,
    public activeModal: NgbActiveModal,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    this.form = this._fb.group({
      UserId: [this.fieldData.UserId],
      OrgId: [this.fieldData.OrgId],
      TaskId: [this.fieldData.TaskId],
      TaskName: [this.fieldData.TaskName, [Validators.required]],
      TaskRate: [this.fieldData.TaskRate, [Validators.required]],
      TaskUnitType: [this.fieldData.TaskUnitType, [Validators.required]]
    });
    this.loadData();

    setTimeout(() => {
      $('.selectpicker').selectpicker('render');
    });
  }

  loadData() {
    this.loadUnitTypes();
  }

  loadUnitTypes() {
    this.isLoading = true;
    this.unitTypes = [];
    this._projectService.getProjectUnitType().subscribe((unitTypes) => {
      if (this.openType === 1) {
        this.form.patchValue(this.fieldData);
      }
      this.unitTypes = unitTypes;
      this.form.get('TaskUnitType').setValue('');
      this.isLoading = false;

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      });
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to load Unit types', {timeout: 3000});
    });
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onSaveTask() {
    this.formIsSubmitted = true;

    if (this.form.valid) {
      this.isLoading = true;
      if (this.openType === 0) {
        this._utService.addAssignTask(this.form.value).subscribe(() => {
          this.emitService.emit(true);
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this._sNotify.error('Failed to add task', {timeout: 3000});
          console.log(err);
        });
      } else {
        this._utService.updateAssignTask(this.form.value).subscribe(() => {
          this.emitService.emit(true);
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this._sNotify.error('Failed to assign task', {timeout: 3000});
          console.log(err);
        });
      }
    }
  }
}
