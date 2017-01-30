import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ApiService {
  private baseApiUrl = `http://${window.location.hostname}:3001/api/`;

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

  updateGrid(square){
    var grid = this.http.post(`${this.baseApiUrl}grid`, square);
    grid.subscribe(
      data => {
        console.log(data.json());
      },
      error => {
        console.log(error);
      }
    )
  }
}
