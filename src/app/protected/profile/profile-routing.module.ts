import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './view/profile.component';

const userRoutes: Routes = [
  {
    path: '', component: ProfileComponent
  },
];


@NgModule( {
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [],
  declarations: []
} )
export class ProfileRoutingModule {}
