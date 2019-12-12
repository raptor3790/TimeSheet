import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-profile-projects',
  templateUrl: './profile-projects-list.component.html',
  styleUrls: ['./profile-projects-list.component.scss']
})
export class ProfileProjectsComponent implements OnInit {

  userId;
  isLoading = false;
  projects = [];

  constructor(private _token: TokenService,
    private _porjectService: ProjectService,
    private _sNotify: SnotifyService) {
  }

  ngOnInit() {
    this.userId = this._token.getCurrentUser().UserId;
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
}
