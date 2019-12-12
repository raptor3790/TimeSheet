import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectUsersComponent } from './project-users/project-users-list.component';
import { ProjectTimesheetsComponent } from './project-timesheets/project-timesheets-list.component';
import { ProjectUserAssignDialogComponent } from './project-user-assign/project-user-assign-dialog.component';
import { ProjectBarchartComponent } from './project-barchart/project-barchart.component';
import { SubprojectListComponent } from './subproject/subproject-list/subproject-list.component';
import { SubProjectDialogComponent } from './subproject/subproject-dialog/subproject-dialog.component';

import { ProjectService } from 'src/app/core/services/project.service';
import { UserService } from 'src/app/core/services/user.service';
import { ProjectExpensesComponent } from './project-expenses/project-expenses-list.component';
import { SubProjectEditComponent } from './subproject/subproject-edit/subproject-edit.component';
import { SubProjectBarchartComponent } from './subproject/subproject-barchart/subproject-barchart.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgbModule.forRoot(),
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ProjectListComponent,
    ProjectNewComponent,
    ProjectEditComponent,
    ProjectFormComponent,
    ProjectUsersComponent,
    ProjectTimesheetsComponent,
    ProjectExpensesComponent,
    ProjectBarchartComponent,
    ProjectUserAssignDialogComponent,
    SubprojectListComponent,
    SubProjectDialogComponent,
    SubProjectEditComponent,
    SubProjectBarchartComponent
  ],
  providers: [
    ProjectService,
    UserService
  ],
  entryComponents: [
    ProjectUserAssignDialogComponent,
    SubProjectDialogComponent
  ]
})
export class ProjectModule { }
