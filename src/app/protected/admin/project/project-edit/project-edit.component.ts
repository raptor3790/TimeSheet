import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/core/services/project.service';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {

  formType;
  message: string;
  success = false;
  data_obs: Observable<any>;

  loading = false;

  constructor(private _activateRoute: ActivatedRoute,
    private _projectService: ProjectService,
    private _tokenService: TokenService) { }

  ngOnInit() {
    this._tokenService.setCurrentTitle('Edit Project');
    this.formType = 1;
    this._activateRoute.params.subscribe(params => {
      const projectId = params['ProjectId'];
      this.data_obs = this._projectService.getProject(projectId);
    });
  }

  save(data) {
    this.loading = true;

    this._projectService.update(data).subscribe(() => {
      this.success = true;
      this.message = 'Successfully saved';
      this.loading = false;
    },
      err => {
        this.success = false;
        if (err.status === 422) {
          this.message = err.error.errors.Email;
        } else {
          this.message = 'Error occured while save Project';
        }

        this.loading = false;
      });
  }

}
