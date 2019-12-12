import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class TimeLineService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin
  public getByTid(timesheetId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timeline/timesheet/${timesheetId}`;
    return this.get(url, this._token.get());
  }

  // get expense timeline
  public getExByTid(expenseReportId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/timeline/expense/${expenseReportId}`;
    return this.get(url, this._token.get());
  }
}
