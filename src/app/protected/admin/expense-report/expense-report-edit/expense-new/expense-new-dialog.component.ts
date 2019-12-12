import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/core/services/token.service';
import { SnotifyService } from 'ng-snotify';
import { ProjectService } from 'src/app/core/services/project.service';
import { ExpenseService } from 'src/app/core/services/expense.service';

declare let $;

@Component({
  selector: 'app-expense-new-dailog',
  templateUrl: './expense-new-dialog.component.html',
  styleUrls: ['./expense-new-dialog.component.scss']
})
export class ExpenseNewDialogComponent implements OnInit {
  @Input() formType;
  @Input() expenseId;
  @Input() userId;
  @Input() expenseReportId;
  @Input() totalCost;
  @Output() emitService = new EventEmitter();

  form: FormGroup;
  formIsSubmitted = false;
  isLoadingProject = false;
  isLoadingTypes = false;
  isLoadingExpense = false;
  projects = [];
  subProjects = [];
  expenseTypes = [];
  imageFile;
  oldCost = 0;

  constructor(
    private _fb: FormBuilder,
    private _pjService: ProjectService,
    private _exService: ExpenseService,
    public activeModal: NgbActiveModal,
    public _token: TokenService,
    private _sNotify: SnotifyService
  ) {}

  ngOnInit() {
    const superObj = this;

    this.form = this._fb.group({
      ProjectId: [null, [Validators.required]],
      SubProjectId: [null, null],
      ExpenseTypeId: [null, [Validators.required]],
      Description: [null, null],
      ExpenseDate: [null, [Validators.required]],
      Cost: [null, [Validators.required]],
      Image: [null, null],
      ImageControl: [null, null]
    });

    $('#ExpenseDate').datetimepicker({
      format: 'DD/MM/YYYY',
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
      }
    });
    $('#ExpenseDate').on('dp.change', function(e) { superObj.onExpenseDateChange(e.target.value); });

    $('.selectpicker').selectpicker();
    this.loadData();
  }

  loadData() {
    this.isLoadingProject = true;
    this._pjService.getProjectByUserId(this.userId).subscribe(
      projects => {
        this.isLoadingProject = false;
        this.projects = projects;
        setTimeout(() => {
          $('#ProjectId').selectpicker('render');
          $('#ProjectId').selectpicker('refresh');
        });
      },
      () => {
        this.isLoadingProject = false;
      }
    );

    this.isLoadingTypes = true;
    this._exService.getExpenseTypes().subscribe(
      types => {
        this.isLoadingTypes = false;
        this.expenseTypes = types;
        setTimeout(() => {
          $('#ExpenseTypeId').selectpicker('render');
          $('#ExpenseTypeId').selectpicker('refresh');
        });
      },
      () => {
        this.isLoadingTypes = false;
      }
    );

    if (this.formType === 1) {
      this.isLoadingExpense = true;
      this._exService.getExpenseById(this.expenseId).subscribe(
        result => {
          result.ExpenseDate = this.convertDateToString(result.ExpenseDate);
          delete result.Image;
          this.oldCost = result.Cost;
          setTimeout(() => {
            this.form.patchValue(result);
            $('.selectpicker').selectpicker('refresh');
            this.isLoadingExpense = false;

            this.onChangeProject();
          }, 500);
        },
        () => {
          this.isLoadingExpense = false;
          console.log('error');
        }
      );
    }
  }

  onChangeProject() {
    this.isLoadingProject = true;
    this._pjService.getSubProjectsByPid(this.form.get('ProjectId').value, 'Active')
      .subscribe((subProjects) => {
        this.subProjects = subProjects;
        console.log(this.subProjects);
        setTimeout(() => {
          $('#SubProjectId').selectpicker('render');
          $('#SubProjectId').selectpicker('refresh');
          this.isLoadingProject = false;
        }, 300);
      }, () => {
        this.isLoadingProject = false;
      });
  }

  onExpenseDateChange(value) {
    this.form.get('ExpenseDate').setValue(value);
  }

  isInvalidField(field: string) {
    return (
      !this.form.get(field).valid &&
      (this.form.get(field).touched || this.formIsSubmitted)
    );
  }

  onSubmit() {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.isLoadingProject = true;
      const data = this.form.value;

      data.ExpenseReportId = this.expenseReportId;
      data.UserId = this.userId;
      data.ExpenseDate = this.convertDateToDashString(data.ExpenseDate);
      data.ProjectName = this.getProjectNameById(data.ProjectId);
      data.SubProjectName = this.getSubProjectNameById(data.SubProjectId);

      data.TotalCost = this.totalCost + parseFloat(this.form.get('Cost').value);

      if (this.formType === 0) {
        this.createExpense(data);
      } else {
        data.TotalCost = data.TotalCost - this.oldCost;
        this.updateExpense(data);
      }
    }
  }

  createExpense(data) {
    this._exService.createExpense(data).subscribe(
      () => {
        this.isLoadingProject = false;
        this.emitService.emit({ success: true });
      },
      err => {
        console.log(err);
        this._sNotify.error('Failed to create timesheet!', { timeout: 3000 });
        this.isLoadingProject = false;
      }
    );
  }

  updateExpense(data) {
    this._exService.updateExpense(this.expenseId, data).subscribe(
      () => {
        this.isLoadingProject = false;
        this.emitService.emit({ success: true });
      },
      err => {
        console.log(err);
        this._sNotify.error('Failed to create timesheet!', { timeout: 3000 });
        this.isLoadingProject = false;
      }
    );
  }

  handleImage(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      ) {
        this.isLoadingProject = true;
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (file.size > 1024 * 1024 * 2) {
            this.form.get('Image').setValue({});
            this.form.get('ImageControl').setValue('');
            this.imageFile = '';
            alert('You can\'t upload more than 2Mb');
          } else {
            this.form.get('Image').setValue({
              filename: file.name,
              filetype: file.type,
              value: reader.result.toString().split(',')[1]
            });
          }

          this.isLoadingProject = false;
        };
      } else {
        this.form.get('ImageControl').setValue('');
        alert('Please select correct image file.');
      }
    }
  }

  getProjectNameById(projectId) {
    for (const project of this.projects) {
      if (projectId === project.ProjectId) {
        return project.ProjectName;
      }
    }
    return '';
  }

  getSubProjectNameById(subProjectId) {
    for (const subProject of this.subProjects) {
      if (subProjectId === subProject.SubProjectId) {
        return subProject.SubProjectName;
      }
    }
    return '';
  }

  convertDateToString(inputFormat, split = '/') {
    const d = new Date(inputFormat);
    return [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join(split);
  }

  convertDateToDashString(inputDate) {
    const arr = inputDate.split('/');
    if (arr.length > 0) {
      return [arr[2], arr[1], arr[0]].join('-');
    }
    return undefined;
  }

  pad(s) {
    return s < 10 ? '0' + s : s;
  }
}
