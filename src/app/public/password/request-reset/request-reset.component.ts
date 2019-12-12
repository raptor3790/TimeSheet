import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit {

  public form = {
    email: null
  };

  constructor(private _auth: AuthService,
    private Notify: SnotifyService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.Notify.info('Wait...', {timeout: 5000});
    this._auth.sendPasswordResetLink(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.Notify.error(error.error.error)
    );
  }

  handleResponse(res) {
    this.Notify.success(res.data, {timeout: 0});
    this.form.email = null;
  }
}
