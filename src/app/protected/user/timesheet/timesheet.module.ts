import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';

import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { TimesheetNewDialogComponent } from './timesheet-new/timesheet-new-dialog.component';
import { TimesheetEditComponent } from './timesheet-edit/timesheet-edit.component';

import { PushService } from 'src/app/core/services/push.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { TimeLineService } from 'src/app/core/services/timeline.service';
import { TimesheetTaskNewDialogComponent } from './timesheet-edit/timesheet-task-new/timesheet-task-new-dialog.component';
import { UserTaskService } from 'src/app/core/services/usertask.service';

@NgModule({
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    SharedModule,
    NgbModule.forRoot(),
    TextMaskModule
  ],
  declarations: [
    TimesheetListComponent,
    TimesheetNewDialogComponent,
    TimesheetEditComponent,
    TimesheetTaskNewDialogComponent
  ],
  providers: [
    TimesheetService,
    TimeLineService,
    ProjectService,
    UserTaskService,
    PushService
  ],
  entryComponents: [
    TimesheetNewDialogComponent,
    TimesheetTaskNewDialogComponent
  ]
})
export class TimesheetModule { }
