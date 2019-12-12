import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loading = false;

  public form: FormGroup;
  public errors: any;

  private formIsSubmitted = false;

  constructor(private _auth: AuthService,
    private _router: Router,
    private _fb: FormBuilder,
    private _notify: SnotifyService,
    private cdr: ChangeDetectorRef) {
    this.form = this._fb.group({
      FirstName: [null, [Validators.required]],
      LastName: [null, [Validators.required]],
      CompanyName: [null, [Validators.required]],
      Mobile: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, [Validators.required, Validators.minLength(6)]],
      Password_confirmation: [null, [Validators.required]],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.errors = undefined;
  }

  onSubmit() {
    this.errors = [];
    const superObj = this;
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this._notify.info('Processing Register...', { timeout: 10000 });
      this.form.value['OrgId'] = '1';
      this.loading = true;
      this._auth.signup(this.form.value).subscribe(
        data => {
          this.loading = false;
          this._notify.remove();
          this._notify.confirm('Successfully registered, Check your email', {
            buttons: [
              {
                text: 'Okay', action: toaster => {
                  superObj._router.navigate(['/login']),
                    this._notify.remove(toaster.id);
                }
              }
            ]
          });
          this.handleResponse(data);
        },
        error => {
          this.handleError(error);
          this.loading = false;
        }
      );
    }
  }

  handleError(error) {
    this._notify.remove();
    this.errors = error.error.errors;
  }

  handleResponse(data) {
    console.log(data);
    /* this._token.handle(data.access_token);
    this._auth.chageAuthStatus(true);
    this._router.navigateByUrl('/dashboard'); */
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  handleSuccess(captchaResponse: string): void {
    console.log('captcha result', captchaResponse);
    this.cdr.detectChanges();
  }
}
