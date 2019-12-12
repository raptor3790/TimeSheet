import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-project-dailog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})

export class ProjectDialogComponent implements OnInit {

  @Input() userId;
  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  projectList = [];
  isLoading = false;
  currentUser;

  dropdownSettings = {
    singleSelection: false,
    idField: 'ProjectId',
    textField: 'ProjectName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  constructor(private _fb: FormBuilder,
    private _projectService: ProjectService,
    public activeModal: NgbActiveModal,
    private _sNotify: SnotifyService,
    private _token: TokenService) { }

  ngOnInit() {
    this.currentUser = this._token.getCurrentUser();
    this.form = this._fb.group({
      UserId: [this.userId],
      OrgId: [this.currentUser.OrgId],
      Projects: [null, [Validators.required]]
    });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._projectService.getNProjectByUserId(this.userId).subscribe((projects) => {
      this.isLoading = false;
      this.projectList = [];
      for (const item of projects) {
        this.projectList.push({ ProjectId: item.ProjectId, ProjectName: item.ProjectName });
      }
    }, () => {
      this.isLoading = false;
    });
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onAssignProject() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this._projectService.addAssignProject(this.form.value).subscribe(() => {
        this.emitService.emit(true);
        this.isLoading = false;
      }, err => {
        console.log(err);
        this._sNotify.error('Failed to assign project!', {timeout: 3000});
        this.isLoading = false;
      });

    }
  }
}
