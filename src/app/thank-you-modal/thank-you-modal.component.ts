import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'thank-you-modal',
  templateUrl: './thank-you-modal.component.html',
  styleUrls: ['./thank-you-modal.component.css']
})
export class ThankYouModalComponent implements OnInit {
  private state;
  @Output() closed = new EventEmitter();
  @Input()
  set show(value) {
    this.state = value;
    console.log(value);
  }
  get show() {
    return this.state;
  }
  private close() {
    this.state = false;
    this.closed.emit(this.state);
  }

  constructor() { }

  ngOnInit() {
  }

}

