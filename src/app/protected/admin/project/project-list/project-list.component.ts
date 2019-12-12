import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';

declare let $;

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  currentUser;
  isLoading = false;
  projects = [];

  constructor(private _token: TokenService,
    private _porjectService: ProjectService,
    private _router: Router) {
  }

  ngOnInit() {
    this._token.setCurrentTitle('Projects');
    this._token.currentUser.subscribe(user => this.currentUser = user);
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._porjectService.getAll('Status').subscribe(projects => {
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
          'autoWidth': false
        });
        superObj.isLoading = false;
      }, 100);
    }, () => {
      this.isLoading = false;
    });
  }

  onSubmit() {
  }

  onSelectUser(projectId) {
    this._router.navigate(['/project/tasks', projectId]);
  }

  delete(event, id) {
    event.stopPropagation();
    const r = confirm('Confirm Project Deletion. \n Note: This will also remove timesheets associated with this Project');
    if (r) {
      this._porjectService.remove(id).subscribe(() => {
        this.loadData();
      },
        () => {
          this.isLoading = false;
        });
    }
  }
}
