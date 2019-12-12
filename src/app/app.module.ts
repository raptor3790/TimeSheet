import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './protected/layout/layout.module';
import { SharedModule as SharedModuleApp } from './shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TokenService } from './core/services/token.service';
import { AuthService } from './core/services/auth.service';

import { PublicGuard } from './core/guards/public.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { SignupComponent } from './public/signup/signup.component';
import { RequestResetComponent } from './public/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './public/password/response-reset/response-reset.component';
import { PagesComponent } from './protected/pages.component';

import { UserService } from './core/services/user.service';
import { TimesheetService } from './core/services/timesheet.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PushService } from './core/services/push.service';
import { SettingModule } from './protected/admin/setting/setting.module';
import { ExpenseService } from './core/services/expense.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SnotifyModule,
    LayoutModule,
    SharedModuleApp,
    SettingModule,
    NgxCaptchaModule.forRoot({
      reCaptcha2SiteKey: '6LcvoUgUAAAAAJJbhcXvLn3KgG-pyULLusaU4mL1'
    }),
    MatProgressBarModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RequestResetComponent,
    ResponseResetComponent,
    PagesComponent
  ],
  providers: [
    TokenService,
    AuthService,
    PushService,
    PublicGuard,
    AuthGuard,
    RoleGuard,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
    UserService,
    TimesheetService,
    ExpenseService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
