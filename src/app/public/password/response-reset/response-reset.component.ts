import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent implements OnInit {

  public errors: any;
  public form = {
    Email: null,
    Password: null,
    Password_confirmation: null,
    resetToken: null
  };

  constructor(private route: ActivatedRoute,
    private _auth: AuthService,
    private router: Router,
    private Notify: SnotifyService) {
    this.route.queryParams.subscribe(params => {
      this.form.resetToken = params['token'];
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this._auth.changePassword(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    console.log(data);
    const _router = this.router;
    this.Notify.confirm('Done!, Now login with new password', {
      buttons: [
        {
          text: 'Okay', action: toaster => {
            _router.navigate(['login']),
              this.Notify.remove(toaster.id);
          }
        }
      ]
    });
  }

  handleError(error) {
    if (error.error.errors !== undefined) {
      this.errors = error.error.errors;
    } else {
      this.Notify.error(error.error.error);
    }
  }
}
