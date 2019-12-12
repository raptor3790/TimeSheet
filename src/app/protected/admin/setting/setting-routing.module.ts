import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingWrapperComponent } from './setting-wrapper/setting-wrapper.component';

const routes: Routes = [
  {
    path: '', component: SettingWrapperComponent
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
export class SettingRoutingModule {}
