import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';

@Injectable()
export class CompanyService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  public getAll(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/company/all`;
    return this.get(url, this._token.get());
  }
}
