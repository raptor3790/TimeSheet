import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class UserTaskService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin
  public addAssignTask(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/usertask`;
    return this.post(url, params, this._token.get());
  }

  public updateAssignTask(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/usertask`;
    return this.put(url, params, this._token.get());
  }

  public removeTask(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/usertask/${id}`;
    return this.delete(url, this._token.get());
  }

  public getUserTasksByUid(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/usertask/${id}`;
    return this.get(url, this._token.get());
  }
}
