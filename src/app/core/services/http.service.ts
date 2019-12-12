import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(public _http: HttpClient, private _tokenService: TokenService) { }

  public get(url, token): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'OrgId' : this._tokenService.getCurrentUser().OrgId
    });
    return this._http.get(url, { headers }).pipe(map(response => response));
  }

  public post(url, params, token?): Observable<any> {
    const headers = !!token ? new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'OrgId' : this._tokenService.getCurrentUser().OrgId
    }) : new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = JSON.stringify(params);

    return this._http.post(url, body, { headers }).pipe(map(response => response));
  }

  public put(url, params, token): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'OrgId' : this._tokenService.getCurrentUser().OrgId
    });

    const body = JSON.stringify(params);

    return this._http.put(url, body, { headers }).pipe(map(response => response));
  }

  public delete(url, token): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'OrgId' : this._tokenService.getCurrentUser().OrgId
    });

    return this._http.delete(url, { headers }).pipe(map(response => response));
  }

}
