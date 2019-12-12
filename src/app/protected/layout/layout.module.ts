import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SuperSidebarComponent } from './super-sidebar/super-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    AdminSidebarComponent,
    SidebarComponent,
    SuperSidebarComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent,
    SidebarComponent,
    SuperSidebarComponent
  ]
})
export class LayoutModule { }
