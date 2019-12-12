import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { Router } from '@angular/router';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-users-projects',
  templateUrl: './users-projects-list.component.html',
  styleUrls: ['./users-projects-list.component.scss']
})
export class UsersProjectsComponent implements OnInit {

  @Input() projectDialog;
  @Input() userId;
  OrgId;
  isLoading = false;
  projects = [];

  constructor(private _token: TokenService,
    private _porjectService: ProjectService,
    private _router: Router,
    private _modalService: NgbModal,
    private _sNotify: SnotifyService) {
  }

  ngOnInit() {
    this.OrgId = this._token.getCurrentUser().OrgId;
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._porjectService.getProjectByUserId(this.userId).subscribe(projects => {
      if ($.fn.DataTable.isDataTable('#project-table')) {
        $('#project-table').DataTable().clear().destroy();
      }
      this.projects = projects;
      setTimeout(function () {
        $('#project-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          lengthMenu: [ [5, 10, 25, 50], [5, 10, 25, 50] ],
          pageLength: 5
        });
        superObj.isLoading = false;
        $('#project-table_wrapper').css('margin', '5px');
      }, 100);
    }, () => {
      this.isLoading = false;
      this._sNotify.error('Failed to load assigned project', {timeout: 3000});
    });
  }

  delete(event, projectId) {
    event.stopPropagation();
    const r = confirm('Are you sure delete project?');
    if (r) {
      this.isLoading = true;
      this._porjectService.removeAssignProject(projectId).subscribe(() => {
        this.loadData();
      },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to delete assigned project', {timeout: 3000});
        });
    }
  }

  addProject() {
    const modalRef = this._modalService.open(ProjectDialogComponent);
    modalRef.componentInstance.userId = this.userId;

    modalRef.componentInstance.emitService.subscribe(() => {
      this.loadData();
      modalRef.close();
    });
  }

  onProjectView(projectId) {
    this._router.navigate(['/admin/project/edit', projectId]);
  }
}
