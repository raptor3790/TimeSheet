import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
// import { PushService } from 'src/app/core/services/push.service';
import { TimesheetService } from 'src/app/core/services/timesheet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser;
  approvedProject = 0;
  title = '';

  constructor(private _router: Router,
    private _token: TokenService,
    // private _pushService: PushService,
    private _timesheetService: TimesheetService) { }

  ngOnInit() {
    // this.importScript();
    this._token.currentUser.subscribe(user => this.currentUser = user);
    this._token.currentTitle.subscribe(title => this.title = title);
    this._timesheetService.submittedTimesheet.subscribe(val => this.approvedProject = val);
    if (this._token.isAdmin()) {
      // this._pushService.updateSubmittedCount();
    }
  }

  onClickNotification() {
    this._router.navigate(['/admin/dashboard']);
  }

  importScript() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'assets/js/material-dashboard.js';
    document.getElementsByTagName('body')[0].appendChild(script);
  }
}
