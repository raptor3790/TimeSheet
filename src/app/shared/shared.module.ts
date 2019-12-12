import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormAlertComponent } from './components/form-alert/form-alert.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OnlyFloatDirective } from './directives/float.directive';
import { SettingComponent } from '../protected/admin/setting/setting/setting.component';
import { UserListComponent } from '../protected/admin/users/user-list/user-list.component';
import { UsersExpensesComponent } from '../protected/admin/users/users-expense-reports/expense-report-list/users-expense-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FormAlertComponent,
    LoadingComponent,
    OnlyFloatDirective,
    SettingComponent,
    UserListComponent,
    UsersExpensesComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormAlertComponent,
    LoadingComponent,
    OnlyFloatDirective,
    SettingComponent,
    UserListComponent,
    UsersExpensesComponent,
  ]
})
export class SharedModule { }
