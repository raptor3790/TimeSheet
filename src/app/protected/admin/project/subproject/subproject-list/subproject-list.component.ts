import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubProjectDialogComponent } from '../subproject-dialog/subproject-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';


declare let $;

@Component({
  selector: 'app-subproject-list',
  templateUrl: './subproject-list.component.html',
  styleUrls: ['./subproject-list.component.scss']
})
export class SubprojectListComponent implements OnInit {

  projectId;
  isLoading = false;
  subProjects = [];

  constructor(
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _pjService: ProjectService,
    private _modalService: NgbModal,
    private _sNotify: SnotifyService) {
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
    this._pjService.getSubProjectsByPid(this.projectId, 'ALL').subscribe(subProjects => {
      if ($.fn.DataTable.isDataTable('#subprojects-table')) {
        $('#subprojects-table').DataTable().clear().destroy();
      }
      this.subProjects = subProjects;
      setTimeout(function () {
        $('#subprojects-table').DataTable({
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
        $('#subprojects-table_wrapper').css('margin', '5px');
      }, 100);
    }, () => {
      this.isLoading = false;
    });
  }

  addSubProject() {
    const modalRef = this._modalService.open(SubProjectDialogComponent);
    modalRef.componentInstance.fieldData = { ProjectId: this.projectId };

    modalRef.componentInstance.emitService.subscribe(() => {
      this.loadData();
      modalRef.close();
    });
  }

  editSubproject(subProject) {
    this._router.navigate(['/admin/project/subproject/edit', this.projectId, subProject.SubProjectId]);
  }

  delete(event, subProjectId) {
    event.stopPropagation();
    const r = confirm('Are you sure delete subproject?');
    if (r) {
      this.isLoading = true;
      this._pjService.removeSubproject(subProjectId).subscribe(() => {
        this.loadData();
      },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to delete subproject.', { timeout: 3000 });
        });
    }
  }

}
