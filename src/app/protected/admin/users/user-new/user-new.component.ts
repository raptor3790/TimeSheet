import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { PasswordValidation } from 'src/app/shared/validations/password.validation';

declare let $;

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {
  formIsSubmitted = false;
  form: FormGroup;
  message: string;
  success = false;
  bUpdating = false;

  roles: any = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Admin', label: 'Admin' }
  ];

  UserType = {
    EMPLOYEE: 'Employee',
    CONTRACTOR: 'Contractor',
    SUBCONTRACTOR: 'Sub-Contractor',
    TEMPORARY: 'Temporary'
  };

  userTypes = [];

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _token: TokenService,
    private _fb: FormBuilder
  ) {
    for (const key of Object.keys(this.UserType)) {
      this.userTypes.push({
        value: this.UserType[key],
        label: this.UserType[key]
      });
    }

    this.form = this._fb.group(
      {
        FirstName: [null, [Validators.required]],
        LastName: [null, [Validators.required]],
        UserRole: ['Basic', [Validators.required]],
        UserType: [this.UserType.EMPLOYEE, [Validators.required]],
        Email: [null, [Validators.required, Validators.email]],
        Mobile: [null, null],
        Password: [null, [Validators.required, Validators.minLength(6)]],
        Password_confirmation: [null, null]
      },
      {
        validator: PasswordValidation.NotMatchPassword
      }
    );
  }

  ngOnInit() {
    this._token.setCurrentTitle('Add User');
    setTimeout(() => {
      $('.selectpicker').selectpicker('render');
    });
  }

  onSubmit() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.bUpdating = true;
      this.message = null;
      this.form.value['OrgId'] = this._token.getCurrentUser().OrgId;
      this.form.value['Status'] = 'Active';
      this._userService.create(this.form.value).subscribe(
        () => {
          this._router.navigate(['/admin/user']);
          this.bUpdating = false;
        },
        err => {
          this.success = false;
          this.bUpdating = false;
          if (err.status === 422) {
            this.message = err.error.errors.Email;
          } else {
            if (!!err.error) {
              this.message = err.error;
            } else {
              this.message = 'Error occured on server.';
            }
          }
        }
      );
    }
  }

  isInvalidField(field: string) {
    return (
      !this.form.get(field).valid &&
      (this.form.get(field).touched || this.formIsSubmitted)
    );
  }
}
