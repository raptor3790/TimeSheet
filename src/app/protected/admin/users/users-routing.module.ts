import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListContainerComponent } from './user-list-container/user-list-container.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserEditComponent } from './user-edit/user-edit.component';


const userRoutes: Routes = [
  {
    path: '', component: UserListContainerComponent
  },
  {
    path: 'new', component: UserNewComponent
  },
  {
    path: 'edit/:id', component: UserEditComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [],
  declarations: []
})
export class UsersRoutingModule { }
