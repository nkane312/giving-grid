import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';
import * as io from 'socket.io-client';



@Injectable()
export class SocketService {
  private socket;
  constructor() {
    this.openConnection();
  }

  openConnection(){
    this.socket = io.connect(`//${window.location.hostname}:5001`, {secure: true});
    this.socket.on('confirmConnection', function(data){
      io.connect(`//${window.location.hostname}:5001`);
      console.log(data);
    });
    this.socket.on('revealSquares', function(data){
      console.log(data);
      
    });
  }
}
