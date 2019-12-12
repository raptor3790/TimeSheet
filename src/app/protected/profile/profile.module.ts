import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './view/profile.component';
import { UserService } from 'src/app/core/services/user.service';
import { UsersModule } from '../admin/users/users.module';
import { ProfileProjectsComponent } from '../user/profile-project-list/profile-projects-list.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    UsersModule
  ],
  declarations: [
    ProfileComponent,
    ProfileProjectsComponent
  ],
  providers: [
    UserService
  ]
})
export class ProfileModule { }
