import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/public/login/login.component';
import { RequestResetComponent } from 'src/app/public/password/request-reset/request-reset.component';
import { ResponseResetComponent } from 'src/app/public/password/response-reset/response-reset.component';
import { SignupComponent } from 'src/app/public/signup/signup.component';
import { PublicGuard } from './core/guards/public.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { PagesComponent } from './protected/pages.component';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'super', component: PagesComponent,
    children: [
      {
        path: '', loadChildren: './protected/super/super.module#SuperModule'
      }
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: [
        'Super'
      ]
    }
  },
  {
    path: 'admin', component: PagesComponent,
    children: [
      {
        path: 'dashboard', loadChildren: './protected/admin/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'user', loadChildren: './protected/admin/users/users.module#UsersModule'
      },
      {
        path: 'project', loadChildren: './protected/admin/project/project.module#ProjectModule'
      },
      {
        path: 'timesheet', loadChildren: './protected/admin/timesheet/timesheet.module#TimesheetModule'
      },
      {
        path: 'expense', loadChildren: './protected/admin/expense-report/expense-report.module#ExpenseReportModule'
      },
      {
        path: 'report', loadChildren: './protected/admin/report/report.module#ReportModule'
      },
      {
        path: 'profile', loadChildren: './protected/profile/profile.module#ProfileModule'
      },
      {
        path: 'setting', loadChildren: './protected/admin/setting/setting.module#SettingModule'
      },
      {
        path: '', pathMatch: 'full', redirectTo: '/admin/dashboard'
      }
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: [
        'Admin', 'Super'
      ]
    }
  },
  {
    path: '', component: PagesComponent,
    children: [
      {
        path: 'timesheet', loadChildren: './protected/user/timesheet/timesheet.module#TimesheetModule'
      },
      {
        path: 'expense', loadChildren: './protected/user/expense-report/expense-report.module#ExpenseReportModule'
      },
      {
        path: 'profile', loadChildren: './protected/profile/profile.module#ProfileModule'
      },
      {
        path: '', pathMatch: 'full', redirectTo: '/timesheet'
      },
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: [
        'Basic',
        'Admin'
      ]
    }
  },
  {
    path: 'login', component: LoginComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'signup', component: SignupComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'request-password-reset', component: RequestResetComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'response-password-reset/:token', component: ResponseResetComponent,
    canActivate: [PublicGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
