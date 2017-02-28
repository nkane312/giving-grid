import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate('250ms')
      ]),
      transition('* => void', [
        animate('250ms', style({transform: 'translateX(100%)'}))
      ])
    ]),
  ],
})
export class TotalComponent implements OnInit {
  @Input() total;
  @Input() finish;
  @Input() totalState;

  private done() {
    if (this.totalState === true) {
      this.finish = true;
    } else {
      this.finish = false;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
