import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { SharedModule as SharedModuleApp } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { UserListContainerComponent } from './user-list-container/user-list-container.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ProjectDialogComponent } from './users-project/project-dialog/project-dialog.component';
import { UsersProjectsComponent } from './users-project/project-list/users-projects-list.component';
import { TaskUsersComponent } from './users-task/task-list/task-users.component';
import { TaskDialogComponent } from './users-task/task-dialog/task-dialog.component';
import { UsersTimesheetsComponent } from './users-timesheet/timesheet-list/users-timesheet-list.component';

import { UserService } from 'src/app/core/services/user.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserTaskService } from '../../../core/services/usertask.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModuleApp,
    UsersRoutingModule,
    TableModule,
    NgbModule.forRoot(),
    TextMaskModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    UserNewComponent,
    UserEditComponent,
    UsersProjectsComponent,
    ProjectDialogComponent,
    TaskUsersComponent,
    TaskDialogComponent,
    UsersTimesheetsComponent,
    UserListContainerComponent
  ],
  providers: [
    UserService,
    ProjectService,
    UserTaskService
  ],
  entryComponents: [
    ProjectDialogComponent,
    TaskDialogComponent
  ],
  exports : [
    UsersProjectsComponent,
    ProjectDialogComponent,
    TaskUsersComponent,
    TaskDialogComponent,
    UsersTimesheetsComponent
  ]
})
export class UsersModule { }
