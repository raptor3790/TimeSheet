import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
import { SuperSettingComponent } from './super-setting/super-setting.component';
import { AuditLogComponent } from './auditlog/auditlog.component';

const routes: Routes = [
  {
    path: 'dashboard', component: SuperDashboardComponent,
  },
  {
    path: 'auditlog', component: AuditLogComponent,
  },
  {
    path: 'setting/:orgId', component: SuperSettingComponent,
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
export class SuperRoutingModule {}
