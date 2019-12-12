import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpenseReportRoutingModule } from './expense-report-routing.module';
import { TextMaskModule } from 'angular2-text-mask';

import { ExpenseReportListComponent } from './expense-report-list/expense-report-list.component';
import { ExpenseReportNewDialogComponent } from './expense-report-new/expense-report-new-dialog.component';
import { ExpenseReportEditComponent } from './expense-report-edit/expense-report-edit.component';

import { PushService } from 'src/app/core/services/push.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';
import { TimeLineService } from 'src/app/core/services/timeline.service';
import { ExpenseNewDialogComponent } from './expense-report-edit/expense-new/expense-new-dialog.component';
import { UserTaskService } from 'src/app/core/services/usertask.service';

@NgModule({
  imports: [
    CommonModule,
    ExpenseReportRoutingModule,
    SharedModule,
    NgbModule.forRoot(),
    TextMaskModule
  ],
  declarations: [
    ExpenseReportListComponent,
    ExpenseReportNewDialogComponent,
    ExpenseReportEditComponent,
    ExpenseNewDialogComponent
  ],
  providers: [
    TimesheetService,
    UserTaskService,
    TimeLineService,
    ProjectService,
    PushService
  ],
  entryComponents: [
    ExpenseReportNewDialogComponent,
    ExpenseNewDialogComponent
  ]
})
export class ExpenseReportModule { }
