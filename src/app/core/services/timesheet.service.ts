import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class TimesheetService extends HttpService {

  private curSbumitted = new BehaviorSubject<any>(0);
  submittedTimesheet = this.curSbumitted.asObservable();

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin functions
  public getTimesheetsByOrgId(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/timesheet/org`;
    return this.get(url, this._token.get());
  }

  public getTimesheetsByTid(timesheetId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/tasks/${timesheetId}`;
    return this.get(url, this._token.get());
  }

  public getTimesheetByUidStatus(userId, status): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/user/status/${userId}/${status}`;
    return this.get(url, this._token.get());
  }

  public getTimesheetsForProject(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/timesheet/project/${projectId}`;
    return this.get(url, this._token.get());
  }

  public getTimesheetsForSubProject(subProjectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/timesheet/subproject/${subProjectId}`;
    return this.get(url, this._token.get());
  }

  public createTask(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/tasks/create`;
    return this.post(url, params, this._token.get());
  }

  // user functions
  public getTimesheet(timesheetId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/get/${timesheetId}`;
    return this.get(url, this._token.get());
  }

  public create(userId, params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/user/create/${userId}`;
    return this.post(url, params, this._token.get());
  }

  public update(timesheetId, params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/update/${timesheetId}`;
    return this.put(url, params, this._token.get());
  }

  public setStatus(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/status`;
    return this.put(url, params, this._token.get());
  }

  public getTimesheetsByUserId(userId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/user/${userId}`;
    return this.get(url, this._token.get());
  }

  public remove(timesheetId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timesheet/user/${timesheetId}`;
    return this.delete(url, this._token.get());
  }

  public changeSubmittedTimesheet(submittedCount) {
    this.curSbumitted.next(submittedCount);
  }
}
