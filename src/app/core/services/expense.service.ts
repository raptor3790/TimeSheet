import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class ExpenseService extends HttpService {

  private curSbumitted = new BehaviorSubject<any>(0);
  submittedTimesheet = this.curSbumitted.asObservable();

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  public getExpenseReportsByOrgId(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/expensereport/org`;
    return this.get(url, this._token.get());
  }

  public getExpenseReportsByUserId(userId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/user/${userId}`;
    return this.get(url, this._token.get());
  }

  public getExpenseReport(reportId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/get/${reportId}`;
    return this.get(url, this._token.get());
  }

  public getExpenseReportsSubmitted(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/submitted`;
    return this.get(url, this._token.get());
  }

  public getExpenseReportsByPid(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/project/${projectId}`;
    return this.get(url, this._token.get());
  }

  public getExpenseReportsBySPid(subProjectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/subproject/${subProjectId}`;
    return this.get(url, this._token.get());
  }

  public create(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/create`;
    return this.post(url, params, this._token.get());
  }

  public setReportStatus(data): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/status`;
    return this.post(url, data, this._token.get());
  }

  public removeExpenseReport(expenseReportId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/${expenseReportId}`;
    return this.delete(url, this._token.get());
  }

  public getExpensesByErid(expenseReportId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/report/${expenseReportId}`;
    return this.get(url, this._token.get());
  }

  public getExpensesSubmitted(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/submitted`;
    return this.get(url, this._token.get());
  }

  public getExpensesProject(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/project`;
    return this.get(url, this._token.get());
  }

  public getExpensesByPid(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/project/${projectId}`;
    return this.get(url, this._token.get());
  }

  public createExpense(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/create`;
    return this.post(url, params, this._token.get());
  }

  public updateExpense(expenseId, params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/update/${expenseId}`;
    return this.put(url, params, this._token.get());
  }

  public getExpenseById(expenseId) {
    const url = `${Config.API_SERVER_URL}/expense/get/${expenseId}`;
    return this.get(url, this._token.get());
  }

  public removeExpense(expenseId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expense/${expenseId}`;
    return this.delete(url, this._token.get());
  }

  public getExpenseTypes(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensetypes`;
    return this.get(url, this._token.get());
  }

  public updateNotes(expenseReportId, params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/expensereport/notes/${expenseReportId}`;
    return this.put(url, params, this._token.get());
  }
}
