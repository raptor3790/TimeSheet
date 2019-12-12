import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PercentageValidation } from 'src/app/shared/validations/percentage.validation';
import { PasswordValidation } from 'src/app/shared/validations/password.validation';
import { Config } from 'src/app/core/config';

declare let $;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  message: string;
  success = false;
  bUpdating = false;

  // variables
  userId;
  data;
  form: FormGroup;
  formIsSubmitted = false;
  photoUrl;
  uploadingImg = false;
  // https://www.npmjs.com/package/angular2-text-mask
  // phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  roles: any = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Admin', label: 'Admin' }
  ];

  statuses = [
    { value: 'Active', label: 'Active' },
    { value: 'Disabled', label: 'Disabled' }
  ];

  userTypes = [];

  UserType = {
    EMPLOYEE: 'Employee',
    CONTRACTOR: 'Contractor',
    SUBCONTRACTOR: 'Sub-Contractor',
    TEMPORARY: 'Temporary'
  };

  constructor(private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _userService: UserService) {
    for (const key of Object.keys(this.UserType)) {
      this.userTypes.push({
        value: this.UserType[key],
        label: this.UserType[key]
      });
    }
  }

  ngOnInit() {
    this.form = this._fb.group({
      UserId: [null],
      FirstName: [null, [Validators.required]],
      LastName: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.email]],
      Status: [null, [Validators.required]],
      UserRole: [null, [Validators.required]],
      Password: [null, [Validators.minLength(6)]],
      Password_confirmation: [null, null],
      UserType: [null, [Validators.required]],
      UserOccupation: [null, null],
      TelNo: [null, null],
      Mobile: [null, null],
      BankName: [null, null],
      BankSortCode: [null, null],
      BankAccountNumber: [null, null],
      TaxReference: [null, null],
      // https://stackoverflow.com/questions/39847862/min-max-validator-in-angular-2-final
      // https://www.concretepage.com/angular-2/angular-2-4-pattern-validation-example
      TaxPercentage: [null, [PercentageValidation.min(0), PercentageValidation.max(100), Validators.pattern('^[0-9]+')]],
      AddressLine1: [null, null],
      AddressLine2: [null, null],
      City: [null, null],
      PostCode: [null, null],
      EmailNotification: [false, null]
    }, {
        validator: PasswordValidation.NotMatchPassword
      });
    this.photoUrl = this.profileImage(null, null);
    this._activateRoute.params.subscribe(params => {
      this.userId = params['id'];
      this._userService.getUser(this.userId).subscribe(user => {
        this.data = user;
        this.form.patchValue(user);
        if (Number(this.data.EmailNotification) === 0) {
          this.form.get('EmailNotification').setValue(false);
        } else {
          this.form.get('EmailNotification').setValue(true);
        }
        this.photoUrl = this.profileImage(this.userId, user.Photo);

        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        });
      }, (err) => {
        console.log(err);
      });
    });

    setTimeout(() => {
      $('.selectpicker').selectpicker('render');
    });
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onSubmit() {
    this.message = null;
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.bUpdating = true;
      this.message = null;
      this._userService.update(this.form.value).subscribe(() => {
        // this._router.navigate(['user']);
        this.message = 'Successfully saved!';
        this.success = true;
        this.bUpdating = false;
      },
        err => {
          this.success = false;
          this.bUpdating = false;
          if (err.status === 422) {
            this.message = err.error.errors.Email;
          } else {
            this.message = 'Error occured while save User';
          }
        });
    } else {
      this.message = 'Please populate all mandatory fields!';
      this.success = false;
    }
  }

  handlePhotoInput(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      const file = files[0];
      if (file.type === 'image/png'
        || file.type === 'image/jpeg'
        || file.type === 'image/jpg') {
        this.uploadingImg = true;
        reader.readAsDataURL(file);
        reader.onload = () => {
          const data = {
            filename: file.name,
            filetype: file.name.substr(file.name.length - 3),
            value: reader.result.toString().split(',')[1],
            UserId: this.userId
          };
          this._userService.uploadPhoto(data).subscribe(response => {
            this.uploadingImg = false;
            this.photoUrl = this.profileImage(this.userId, response);
          }, error => {
            this.uploadingImg = false;
            console.log(error);
          });
        };
      } else {
        alert('Please select correct image file.');
      }
    }
  }

  profileImage(userId, photo) {
    if (!!photo) {
      return Config.API_RESOURCE_URL + '/photos/' + userId + '/' + photo;
    } else {
      return Config.APP_IMAGE_PATH + '/avatar.jpg';
    }
  }
}
