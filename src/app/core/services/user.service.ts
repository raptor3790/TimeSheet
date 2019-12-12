import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';

@Injectable()
export class UserService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin
  public create(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/user/create`;
    return this.post(url, params, this._token.get());
  }

  public remove(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/user/delete/${id}`;
    return this.delete(url, this._token.get());
  }

  public getAll(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/user/all`;
    return this.get(url, this._token.get());
  }

  public getAllByOrgId(orgId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/user/all/${orgId}`;
    return this.get(url, this._token.get());
  }

  public getBasicAll(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/user/basic/all`;
    return this.get(url, this._token.get());
  }

  // user
  public update(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/update`;
    return this.put(url, params, this._token.get());
  }

  public getUser(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/get/${id}`;
    return this.get(url, this._token.get());
  }

  public getAdminMessageToken(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user_admintoken`;
    return this.get(url, this._token.get());
  }

  public updateMessageToken(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user_message`;
    return this.put(url, params, this._token.get());
  }

  public search(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/search`;
    return this.post(url, params, this._token.get());
  }

  public getUsersForProject(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/project/${projectId}`;
    return this.get(url, this._token.get());
  }

  public getUsersNotForProject(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/project_notin/${projectId}`;
    return this.get(url, this._token.get());
  }

  public uploadPhoto(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/user/photo`;
    return this.post(url, params, this._token.get());
  }

  public getLogs() {
    const url = `${Config.API_SERVER_URL}/admin/user/logs`;
    return this.get(url, this._token.get());
  }
}
