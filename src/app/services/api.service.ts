import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ApiService {
  private baseApiUrl = `http://${window.location.hostname}:3001/api/`;
  constructor(private http: Http) { }

  getGrid(){
    var grid = this.http.get(`${this.baseApiUrl}grid`);
    console.log(grid);
    grid.subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  updateGrid(){

  }

}
