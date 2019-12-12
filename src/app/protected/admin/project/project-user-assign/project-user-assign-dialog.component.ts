import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserService } from 'src/app/core/services/user.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-project-user-assign-dialog',
  templateUrl: './project-user-assign-dialog.component.html',
  styleUrls: ['./project-user-assign-dialog.component.scss']
})

export class ProjectUserAssignDialogComponent implements OnInit {

  @Input() projectId;
  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  projectList = [];
  isLoading = false;
  weekEnding = null;
  currentUser;
  userList = [];
  dropdownSettings = {};

  constructor(private _fb: FormBuilder,
    private _projectService: ProjectService,
    private _userService: UserService,
    public activeModal: NgbActiveModal,
    public _token: TokenService,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'UserId',
      textField: 'UserName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.currentUser = this._token.getCurrentUser();
    this.form = this._fb.group({
      users: [null, Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._userService.getUsersNotForProject(this.projectId).subscribe(res => {
      this.isLoading = false;
      this.userList = [];
      for (const item of res) {
        this.userList.push({ UserId: item.UserId, UserName: item.UserName });
      }
    }, () => {
      this.isLoading = false;
    });
  }

  onAssignUser() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;
      data['projectId'] = this.projectId;
      console.log(data);
      this._projectService.addAssignUsersToProject(data).subscribe(() => {
        this.emitService.emit();
      }, () => {
        this._sNotify.error('Failed to Assign Timesheet!', { timeout: 3000 });
        this.isLoading = false;
      });
    }
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }
}
