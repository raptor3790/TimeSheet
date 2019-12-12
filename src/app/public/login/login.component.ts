import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;

  public form: FormGroup;

  public errors = null;

  private formIsSubmitted = false;

  constructor(private _auth: AuthService,
    private _token: TokenService,
    private _router: Router,
    private _fb: FormBuilder) {
    this.form = this._fb.group({
      Email: [null, [Validators.required, Validators.email]],
      OrgId: [null, [Validators.required]],
      Password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.errors = null;
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.loading = true;
      this._auth.login(this.form.value).subscribe(
        data => {
          this.handleResponse(data);
        },
        error => {
          this.loading = false;
          this.handleError(error);
        }
      );
    }
  }

  handleResponse(data) {
    this._token.handle(data.access_token, data.user);
    this._auth.chageAuthStatus(true);
    if (this._token.isAdmin()) {
      this._router.navigateByUrl('/admin/dashboard');
    } else if (this._token.isSuperAdmin()) {
      this._router.navigateByUrl('/super/dashboard');
    } else {
      this._router.navigateByUrl('/timesheet');
    }
  }

  handleError(error) {
    if (error.error.error !== undefined) {
      this.errors = error.error.error;
    } else {
      this.errors = 'Some error occured on server.';
    }
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

}
