import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { UserService } from 'src/app/core/services/user.service';
import { SnotifyService } from 'ng-snotify';

declare let $;

@Component({
  selector: 'app-expense-report-new-dailog',
  templateUrl: './expense-report-new-dialog.component.html',
  styleUrls: ['./expense-report-new-dialog.component.scss']
})

export class ExpenseReportNewDialogComponent implements OnInit {

  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  isLoadingUser = false;
  currentUser: any;
  users = [];

  constructor(private _fb: FormBuilder,
    private _userService: UserService,
    private _exService: ExpenseService,
    public activeModal: NgbActiveModal,
    public _token: TokenService,
    private _sNotify: SnotifyService) { }

  ngOnInit() {
    this.currentUser = this._token.getCurrentUser();
    this.form = this._fb.group({
      UserId: [this.currentUser.UserId, Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.isLoadingUser = true;
    this._userService.getBasicAll().subscribe(users => {
      this.users = users;
      this.form.get('UserId').setValue(this.currentUser.UserId);

      setTimeout(() => {
        $('.selectpicker').selectpicker('render');
        this.isLoadingUser = false;
      }, 300);
    }, () => {
      this.isLoadingUser = false;
    });
  }

  isInvalidField(field: string) {
    return (
      (!this.form.get(field).valid && (this.form.get(field).touched || this.formIsSubmitted))
    );
  }

  onCreateExpenseReport() {
    this.formIsSubmitted = true;

    if (this.form.valid) {
      this.isLoadingUser = true;
      const userId = parseInt(this.form.get('UserId').value, 10);
      const selectedUser = this.findUserById(userId);
      if (selectedUser) {
        // https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
        const data: { [k: string]: any } = {};
        data.UserId = userId;
        data.UserName = selectedUser.UserName;
        this._exService.create(data).subscribe((insertedId) => {
          this.isLoadingUser = false;
          data.insertedId = insertedId;
          this.emitService.emit(data);
        }, err => {
          console.log(err);
          this._sNotify.error('Failed to create Expense Report!', { timeout: 3000 });
          this.isLoadingUser = false;
        });
      } else {
        this.isLoadingUser = false;
      }
    }
  }

  findUserById(id) {
    if (this.currentUser.UserId === id) {
      return this.currentUser;
    }
    for (const user of this.users) {
      if (user.UserId === id) {
        return user;
      }
    }
    return false;
  }
}
