import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ApiService {
  private baseApiUrl = `//${window.location.hostname}:8443/api/`;

  private _grid$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor(private http: Http) { }

  getGrid(campaign, version){
    var grid = this.http.get(`${this.baseApiUrl}grid?campaign=${campaign}&version=${version}`);
    grid.subscribe(
      data => {
        this._grid$.next(data.json());
      },
      error => {
        console.log(error);
      }
    );
    return Observable.from(this._grid$);
  }

  updateGrid(_id, indexes){
    this.http.post(`${this.baseApiUrl}grid`, {_id, indexes}).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }
}
