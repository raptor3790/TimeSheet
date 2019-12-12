import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { TimesheetEditComponent } from './timesheet-edit/timesheet-edit.component';

const userRoutes: Routes = [
  {
    path: '', component: TimesheetListComponent
  },
  {
    path: 'edit/:userId/:timesheetId', component: TimesheetEditComponent
  }
];


@NgModule( {
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [],
  declarations: []
} )
export class TimesheetRoutingModule {}
