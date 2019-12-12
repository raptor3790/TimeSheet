import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './index/dashboard.component';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    RouterModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    ProjectService,
    TimesheetService
  ]
})
export class DashboardModule { }
