import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { UserService } from 'src/app/core/services/user.service';
import { TimeLineService } from 'src/app/core/services/timeline.service';
import { SnotifyService } from 'ng-snotify';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseNewDialogComponent } from './expense-new/expense-new-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';

declare let $;

@Component({
  selector: 'app-expense-report-edit',
  templateUrl: './expense-report-edit.component.html',
  styleUrls: ['./expense-report-edit.component.scss']
})
export class ExpenseReportEditComponent implements OnInit {
  currentUser = null; // signed in user
  formIsSubmitted = false;
  isLoading = false;
  expenses = []; // expense list for project and signed in user
  timelines = [];
  expenseReportId;
  userId;
  rejectReason = '';
  espenseStatus;
  notes = '';
  previewImage = '';
  created_at = '';
  reEdit = false;

  constructor(
    private _exService: ExpenseService,
    private _sNotify: SnotifyService,
    private _tlService: TimeLineService,
    private _activatedRouter: ActivatedRoute,
    private _userService: UserService,
    private _modalService: NgbModal,
    private _tokenService: TokenService
  ) { }

  ngOnInit() {
    this._tokenService.setCurrentTitle('Expense Edit');
    this._activatedRouter.params.subscribe(params => {
      this.userId = params['userId'];
      this.expenseReportId = params['reportId'];
      this.loadData();
    });
  }

  loadData() {
    this.isLoading = true;
    this._exService
      .getExpenseReport(this.expenseReportId)
      .subscribe(expense => {
        this.espenseStatus = expense.Status;
        this.notes = expense.Notes;
        this.created_at = this.convertDateToString(expense.created_at);
        if (expense.Status === 'Rejected') {
          this.rejectReason = expense.RejectedReason;
        }
      });
    this._userService.getUser(this.userId).subscribe(
      user => {
        this.currentUser = user;
        this._exService.getExpensesByErid(this.expenseReportId).subscribe(
          expenses => {
            this.isLoading = false;
            this.expenses = expenses;
          },
          () => {
            this.isLoading = false;
            this._sNotify.error('Failed while loading expenses');
          }
        );
      },
      () => {
        this.isLoading = false;
        this._sNotify.error('Failed while loading user information');
      }
    );

    this.loadTimeLines();
  }

  loadTimeLines() {
    this._tlService.getExByTid(this.expenseReportId).subscribe(timelines => {
      this.timelines = timelines;
    });
  }

  onAddExpense() {
    // open new dailog which contains project.
    const modalRef = this._modalService.open(ExpenseNewDialogComponent);

    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.expenseReportId = this.expenseReportId;
    modalRef.componentInstance.formType = 0;
    modalRef.componentInstance.totalCost = this.sumOfTotal();
    modalRef.componentInstance.emitService.subscribe(() => {
      modalRef.close();
      this.loadData();
    });
  }

  onEditExpense(expenseId) {
    // open new dailog which contains project.
    if (!(this.isDraft() || this.isRejected()) && !this.reEdit) {
      return;
    }

    const modalRef = this._modalService.open(ExpenseNewDialogComponent);

    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.expenseReportId = this.expenseReportId;
    modalRef.componentInstance.expenseId = expenseId;
    modalRef.componentInstance.formType = 1;
    modalRef.componentInstance.totalCost = this.sumOfTotal();
    modalRef.componentInstance.emitService.subscribe(() => {
      modalRef.close();
      this.loadData();
    });
  }

  onReEdit() {
    this.reEdit = true;
  }

  delete(event, expenseId) {
    event.stopPropagation();
    this.isLoading = true;
    this._exService.removeExpense(expenseId).subscribe(
      () => {
        this.isLoading = false;
        this._sNotify.success('Succeeded to deleting expenses');
        this.loadData();
      },
      () => {
        this.isLoading = false;
        this._sNotify.error('Failed while deleting expenses');
      }
    );
  }

  sumOfTotal() {
    let sum = 0;
    for (const expense of this.expenses) {
      if (expense.Cost) {
        sum += parseFloat(expense.Cost);
      }
    }
    return sum;
  }

  saveNotes() {
    this.isLoading = true;

    const data: any = {
      Notes: this.notes,
    };

    if (this.reEdit) {
      data.reedit = true;
    }

    this._exService.updateNotes(this.expenseReportId, data).subscribe(
      () => {
        if (this.reEdit) {
          this.loadTimeLines();
        }
        this.isLoading = false;
        this.reEdit = false;
        this._sNotify.success('Expense Report Saved');
      },
      () => {
        this.isLoading = false;
        this._sNotify.error('Failed to Save Expense Report');
      }
    );
  }

  modifyExpenseReport(status) {
    let reasonBox = '';
    if (status === 'Rejected') {
      reasonBox = prompt('Please enter the reason for rejecting');
      if (reasonBox == null) {
        return;
      }
      this.rejectReason = reasonBox;
    }
    this.isLoading = true;
    const data = {
      ExpenseReportId: this.expenseReportId,
      Status: status,
      UserId: this.currentUser.UserId,
      Date: this.created_at,
      TotalPrice: this.sumOfTotal(),
      RejectedReason: reasonBox
    };
    this._exService.setReportStatus(data).subscribe(
      () => {
        this.espenseStatus = status;
        this._sNotify.success('Successful!');
        this.isLoading = false;
        this.loadTimeLines();
      },
      () => {
        this.isLoading = false;
        this._sNotify.error('Failed to action.');
      }
    );
  }

  onPreview(event, imgSrc) {
    event.stopPropagation();
    this.previewImage = imgSrc;
    $('#myModal').modal();
  }

  convertDateToString(inputFormat, split = '/') {
    const d = new Date(inputFormat);
    return [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join(split);
  }

  pad(s) {
    return s < 10 ? '0' + s : s;
  }

  isDraft() {
    return this.espenseStatus === 'Draft';
  }

  isCancelled() {
    return this.espenseStatus === 'Cancelled';
  }

  isRejected() {
    return this.espenseStatus === 'Rejected';
  }

  isSubmitted() {
    return this.espenseStatus === 'Submitted';
  }

  isApproved() {
    return this.espenseStatus === 'Approved';
  }

  isPaid() {
    return this.espenseStatus === 'Paid';
  }
}
