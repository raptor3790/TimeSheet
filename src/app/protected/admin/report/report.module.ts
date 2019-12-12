import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportWeekComponent } from './week/report-week.component';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportMonthComponent } from './month/report-month.component';

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule,
    RouterModule
  ],
  declarations: [
    ReportWeekComponent,
    ReportMonthComponent
  ],
  providers: [
    ReportService,
  ]
})
export class ReportModule { }
