import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.scss']
})
export class ProjectNewComponent implements OnInit {

  formType;
  message: string;
  success = false;

  loading = false;

  constructor(private _router: Router,
    private _projectService: ProjectService,
    private _token: TokenService) { }

  ngOnInit() {
    this.formType = 0;
    this._token.setCurrentTitle('Create Project');
  }

  save(data) {
    this.loading = true;

    data['OrgId'] = this._token.getCurrentUser().OrgId;
    this._projectService.create(data).subscribe(() => {
      this.success = false;
      this._router.navigate(['/admin/project']);
    },
      err => {
        this.success = false;
        if (err.status === 422) {
          this.message = err.error.errors.Email;
        } else {
          this.message = 'Error occured on server.';
        }

        this.success = false;
      });
  }
}
