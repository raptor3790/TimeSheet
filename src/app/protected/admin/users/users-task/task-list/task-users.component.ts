import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';
import { UserTaskService } from 'src/app/core/services/usertask.service';
import { SnotifyService } from 'ng-snotify';


declare let $;

@Component({
  selector: 'app-task-users',
  templateUrl: './task-users.component.html',
  styleUrls: ['./task-users.component.scss']
})
export class TaskUsersComponent implements OnInit {

  @Input() userId;
  OrgId;
  isLoading = false;
  tasks = [];

  constructor(private _token: TokenService,
    private _utService: UserTaskService,
    private _modalService: NgbModal,
    private _sNotify: SnotifyService) {
  }

  ngOnInit() {
    this.OrgId = this._token.getCurrentUser().OrgId;
    this.loadData();
  }

  loadData() {
    const superObj = this;
    this.isLoading = true;
    this._utService.getUserTasksByUid(this.userId).subscribe(tasks => {
      if ($.fn.DataTable.isDataTable('#task-table')) {
        $('#task-table').DataTable().clear().destroy();
      }
      this.tasks = tasks;
      setTimeout(function () {
        $('#task-table').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          lengthMenu: [ [5, 10, 25, 50], [5, 10, 25, 50] ],
          pageLength: 5
        });
        superObj.isLoading = false;
        $('#task-table_wrapper').css('margin', '5px');
      }, 100);
    }, () => {
      this.isLoading = false;
    });
  }

  addUserTask() {
    const modalRef = this._modalService.open(TaskDialogComponent);
    modalRef.componentInstance.openType = 0;
    modalRef.componentInstance.fieldData = { UserId: this.userId, OrgId: this.OrgId };

    modalRef.componentInstance.emitService.subscribe(() => {
      this.loadData();
      modalRef.close();
    });
  }

  editTask(task) {
    const modalRef = this._modalService.open(TaskDialogComponent);
    modalRef.componentInstance.openType = 1;
    task.UserId = this.userId;
    task.OrgId = this.OrgId;
    modalRef.componentInstance.fieldData = task;

    modalRef.componentInstance.emitService.subscribe(() => {
      this.loadData();
      modalRef.close();
    });
  }

  delete(event, taskId) {
    event.stopPropagation();
    const r = confirm('Confirm Task Deletion');
    if (r) {
      this.isLoading = true;
      this._utService.removeTask(taskId).subscribe(() => {
        this.loadData();
      },
        () => {
          this.isLoading = false;
          this._sNotify.error('Failed to delete task.', {timeout: 3000});
        });
    }
  }

}
