import { NgModule } from '@angular/core';
import { SharedModule as SharedModuleApp} from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { SuperRoutingModule } from './super-routing.module';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
import { CompanyService } from 'src/app/core/services/company.service';
import { SuperSettingComponent } from './super-setting/super-setting.component';
import { AuditLogComponent } from './auditlog/auditlog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModuleApp,
    SuperRoutingModule,
  ],
  declarations: [
    SuperDashboardComponent,
    SuperSettingComponent,
    AuditLogComponent
  ],
  providers: [
    CompanyService
  ]
})
export class SuperModule { }
