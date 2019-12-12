import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class SettingService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin
  public getCompanyById(orgId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/company/get/${orgId}`;
    return this.get(url, this._token.get());
  }

  public getCompany(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/company/get`;
    return this.get(url, this._token.get());
  }

  public updateCompany(orgId, params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/company/update/${orgId}`;
    return this.put(url, params, this._token.get());
  }

}
