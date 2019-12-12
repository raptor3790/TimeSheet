import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from 'src/app/shared/validations/password.validation';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { SnotifyService } from 'ng-snotify';
import { Config } from 'src/app/core/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  currentUser;
  formIsSubmitted = false;
  photoUrl;
  uploadingImg = false;
  bUpdating = false;
  TimesheetStatus = [];

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    public _tokenService: TokenService,
    private _sNotify: SnotifyService
  ) {
    this.form = this._fb.group(
      {
        UserId: [null],
        FirstName: [null, [Validators.required]],
        LastName: [null, [Validators.required]],
        Email: [null, [Validators.required, Validators.email]],
        Password: [null, Validators.minLength(6)],
        Password_confirmation: [null, null],
        UserOccupation: [null, null],
        TelNo: [null, null],
        Mobile: [null, null],
        BankName: [null, null],
        BankSortCode: [null, null],
        BankAccountNumber: [null, null],
        TaxReference: [null, null],
        TaxPercentage: [null, null],
        AddressLine1: [null, null],
        AddressLine2: [null, null],
        City: [null, null],
        PostCode: [null, null],
        EmailNotification: [false, null]
      },
      {
        validator: PasswordValidation.NotMatchPassword
      }
    );
  }

  ngOnInit() {
    this._tokenService.setCurrentTitle('Profile');
    this._tokenService.currentUser.subscribe(user => (this.currentUser = user));
    this.photoUrl = this.profileImage(
      this.currentUser.UserId,
      this.currentUser.Photo
    );
    this.form.patchValue(this.currentUser);
    if (this.currentUser.EmailNotification === '0') {
      this.form.get('EmailNotification').setValue(false);
    } else {
      this.form.get('EmailNotification').setValue(true);
    }
  }

  onSubmit() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.bUpdating = true;
      this._userService.update(this.form.value).subscribe(
        () => {
          for (const key of Object.keys(this.form.value)) {
            this.currentUser[key] = this.form.value[key];
          }
          this._tokenService.setCurrentUser(this.currentUser);
          this.bUpdating = false;
          this._sNotify.success('Your profile has been updated successfully.');
        },
        error => {
          this.bUpdating = false;
          if (error.status === 422) {
            this._sNotify.error('Email has already taken');
            this.form.get('Email').setErrors({ hastaken: true });
          }
          this._sNotify.error('Error occured whild update profile');
        }
      );
    }
  }

  handlePhotoInput(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      const file = files[0];
      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      ) {
        this.uploadingImg = true;
        reader.readAsDataURL(file);
        reader.onload = () => {
          const data = {
            filename: file.name,
            filetype: file.name.substr(file.name.length - 3),
            value: reader.result.toString().split(',')[1],
            UserId: this.currentUser.UserId
          };
          this._userService.uploadPhoto(data).subscribe(
            response => {
              this.uploadingImg = false;
              this.currentUser.Photo = response;
              this._tokenService.setCurrentUser(this.currentUser);
              this.photoUrl = this.profileImage(
                this.currentUser.UserId,
                this.currentUser.Photo
              );
            },
            error => {
              this.uploadingImg = false;
              console.log(error);
            }
          );
        };
      } else {
        this.form.get('ImageControl').setValue('');
        alert('Please select correct image file.');
      }
    }
  }

  isInvalidField(field: string) {
    return (
      !this.form.get(field).valid &&
      (this.form.get(field).touched || this.formIsSubmitted)
    );
  }

  profileImage(userId, photo) {
    if (!!photo) {
      return Config.API_RESOURCE_URL + '/photos/' + userId + '/' + photo;
    } else {
      return Config.APP_IMAGE_PATH + '/avatar.jpg';
    }
  }
}
