import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class ReportService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  public getReportsByWeek(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/report/week`;
    return this.post(url, params, this._token.get());
  }

  public getReportsByMonth(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/report/month`;
    return this.post(url, params, this._token.get());
  }

}
