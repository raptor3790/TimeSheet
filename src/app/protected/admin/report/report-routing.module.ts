import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportWeekComponent } from './week/report-week.component';
import { ReportMonthComponent } from './month/report-month.component';

const routes: Routes = [
  {
    path: 'week', component: ReportWeekComponent
  },
  {
    path: 'month', component: ReportMonthComponent
  }
];


@NgModule( {
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: []
} )
export class ReportRoutingModule {}
