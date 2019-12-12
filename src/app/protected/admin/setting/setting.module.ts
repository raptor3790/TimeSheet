import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingRoutingModule } from './setting-routing.module';

import { SettingService } from 'src/app/core/services/setting.service';

import { SettingWrapperComponent } from './setting-wrapper/setting-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  declarations: [
    SettingWrapperComponent
  ],
  providers: [
    SettingService
  ]
})
export class SettingModule { }
