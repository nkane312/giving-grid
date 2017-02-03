import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Custombox } from 'custombox/src';

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
    if (this.state === true) {
      modal.open();
    } else {
      modal.close();
    }
  }
  get show() {
    return this.state;
  }
  private close() {
    this.show = false;
    this.closed.emit(this.state);
  }

  private modal = new Custombox.modal({
    content: {
        effect: 'fadein',
        target: '#modal'
    }
  });

  
  constructor() { }

  ngOnInit() {
  }

}
