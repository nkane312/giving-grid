import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(-200%)'}),
        animate(750)
      ]),
      transition('* => void', [
        animate(750, style({transform: 'translateY(-200%)'}))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({opacity: 0.75})),
      transition('void => *', [
        style({opacity: 0}),
        animate(750)
      ]),
      transition('* => void', [
        animate(750, style({opacity: 0}))
      ])
    ])
  ],
})
export class InformationComponent implements OnInit {
  private state;
  @Output() closed = new EventEmitter();
  @Input()
  set show(value) {
    this.state = value;
  }
  get show() {
    return this.state;
  }
  private close() {
    this.show = false;
    this.closed.emit(this.state);
  }

  constructor() { }

  ngOnInit() {
  }

}
