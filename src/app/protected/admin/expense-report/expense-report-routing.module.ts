import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseReportListComponent } from './expense-report-list/expense-report-list.component';
import { ExpenseReportEditComponent } from './expense-report-edit/expense-report-edit.component';

const userRoutes: Routes = [
  {
    path: '', component: ExpenseReportListComponent
  },
  {
    path: 'edit/:userId/:reportId', component: ExpenseReportEditComponent
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
export class ExpenseReportRoutingModule {}
