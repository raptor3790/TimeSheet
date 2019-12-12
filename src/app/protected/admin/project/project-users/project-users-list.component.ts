import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnotifyService } from 'ng-snotify';
import { UserService } from 'src/app/core/services/user.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ProjectUserAssignDialogComponent } from '../project-user-assign/project-user-assign-dialog.component';

declare let $;

@Component({
  selector: 'app-project-users-list',
  templateUrl: './project-users-list.component.html',
  styleUrls: ['./project-users-list.component.scss']
})
export class ProjectUsersComponent implements OnInit {

  projectId;
  isLoading = false;
  users = [];

  constructor(private _userService: UserService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _porjectService: ProjectService,
    private _modalService: NgbModal) {
  }

  ngOnInit() {
    this._activatedRouter.params.subscribe(params => {
      this.projectId = params['ProjectId'];
      this.loadData();
    });
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._userService.getUsersForProject(this.projectId).subscribe(users => {
      this.users = users;
      if ($.fn.DataTable.isDataTable('#project-user-table')) {
        $('#project-user-table').DataTable().clear().destroy();
      }
      setTimeout(function () {
        $('#project-user-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
          pageLength: 5
        });
        superObj.isLoading = false;
        $('#project-user-table_wrapper').css('margin', '5px');
      }, 100);
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to load users of project', { timeout: 3000 });
    });
  }

  onUserView(userId) {
    this._router.navigate(['/admin/user/edit', userId]);
  }

  onAddUser() {
    // open new dailog which contains project.
    const modalRef = this._modalService.open(ProjectUserAssignDialogComponent);
    modalRef.componentInstance.projectId = this.projectId;

    modalRef.componentInstance.emitService.subscribe(() => {
      modalRef.close();
      this.loadData();
    });
  }

  unassignUser(event, userId) {
    event.stopPropagation();
    const r = confirm('Remove User from Project?');
    if (r) {
      this.isLoading = true;
      this._porjectService.removeAssignProjectByUser(userId, this.projectId).subscribe(() => {
        this.loadData();
      },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to delete assigned project', { timeout: 3000 });
        });
    }
  }
}
