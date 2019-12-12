import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { SubProjectEditComponent } from './subproject/subproject-edit/subproject-edit.component';

const userRoutes: Routes = [
  {
    path: '', component: ProjectListComponent
  },
  {
    path: 'new', component: ProjectNewComponent
  },
  {
    path: 'edit/:ProjectId', component: ProjectEditComponent
  },
  {
    path: 'subproject/edit/:ProjectId/:SubProjectId', component: SubProjectEditComponent
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
export class ProjectRoutingModule {}
