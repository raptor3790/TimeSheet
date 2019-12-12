import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { Config } from '../config';

@Injectable()
export class ProjectService extends HttpService {

  constructor(public _http: HttpClient, private _token: TokenService) {
    super(_http, _token);
  }

  // admin
  public create(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/create`;
    return this.post(url, params, this._token.get());
  }

  public update(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/update`;
    return this.put(url, params, this._token.get());
  }

  public getAll(sortField): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/all/${sortField}`;
    return this.get(url, this._token.get());
  }

  public getProjectsByStatus(status): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/status/${status}`;
    return this.get(url, this._token.get());
  }

  public getPaidTotals(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/paids`;
    return this.get(url, this._token.get());
  }

  public getProjectActualPrice(projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/price/${projectId}`;
    return this.get(url, this._token.get());
  }

  public addSubProject(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/subprojects`;
    return this.post(url, params, this._token.get());
  }

  public updateSubProject(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/subprojects`;
    return this.put(url, params, this._token.get());
  }

  public getSubProjetById(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/subprojects/${id}`;
    return this.get(url, this._token.get());
  }

  public getSubProjectsByPid(pid, status): Observable<any> {
    const url = `${Config.API_SERVER_URL}/subprojects/project/${pid}/${status}`;
    return this.get(url, this._token.get());
  }

  public getSubProjectActualPrice(subProjectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/subprojects/price/${subProjectId}`;
    return this.get(url, this._token.get());
  }

  public removeSubproject(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/subprojects/${id}`;
    return this.delete(url, this._token.get());
  }

  public remove(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/del/${id}`;
    return this.delete(url, this._token.get());
  }

  public addAssignProject(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/user/create`;
    return this.post(url, params, this._token.get());
  }

  public addAssignUsersToProject(params): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/user/assign`;
    return this.post(url, params, this._token.get());
  }

  public removeAssignProject(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/user/${id}`;
    return this.delete(url, this._token.get());
  }

  public removeAssignProjectByUser(userId, projectId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/admin/project/user_project/${userId}/${projectId}`;
    return this.delete(url, this._token.get());
  }

  // user
  public getProject(id): Observable<any> {
    const url = `${Config.API_SERVER_URL}/project/get/${id}`;
    return this.get(url, this._token.get());
  }

  public getProjectUnitType(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/project/unittypes`;
    return this.get(url, this._token.get());
  }

  public getProjectByUserId(userId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/project/user/get/${userId}`;
    return this.get(url, this._token.get());
  }

  public getNProjectByUserId(userId): Observable<any> {
    const url = `${Config.API_SERVER_URL}/project/user/rest/${userId}`;
    return this.get(url, this._token.get());
  }

  // get project list not added
  public getTNProjectByUserId(): Observable<any> {
    const url = `${Config.API_SERVER_URL}/project/timesheet/rest`;
    return this.get(url, this._token.get());
  }

  // get sub projects by user id
  public getSubProjectsByUid(userId, status): Observable<any> {
    const url = `${Config.API_SERVER_URL}/subprojects/user/${userId}/${status}`;
    return this.get(url, this._token.get());
  }
}
