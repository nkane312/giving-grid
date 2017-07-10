import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

import {ShareButtonsModule} from "ng2-sharebuttons";

@Component({
  selector: 'thank-you-modal',
  templateUrl: './thank-you-modal.component.html',
  styleUrls: ['./thank-you-modal.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(-200%)'}),
        animate(1000)
      ]),
      transition('* => void', [
        animate(1000, style({transform: 'translateY(-200%)'}))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({opacity: 0.75})),
      transition('void => *', [
        style({opacity: 0}),
        animate(1000)
      ]),
      transition('* => void', [
        animate(1000, style({opacity: 0}))
      ])
    ])
  ],
})
export class ThankYouModalComponent implements OnInit {
  @Input() total; 
  private url = this.trimPayPal(window.location.href);
  private title = 'Give Together to Save a Life!';
  private tags = 'TheFellowship';
  private description = 'As the Fellowship community bands together, a special image will be revealed to show your impact';
  private shareTitle = 'Share Your Ministry Effort With Others!';
  private fbInner = "<img src='../assets/facebook.svg'>";
  private twitterInner = "<img src='../assets/twitter.svg'>";
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
  private trimPayPal(url) {
    if (location.search === '?paypal=complete') {
      return url.split('?')[0];
    } else {
      return url;
    }
  }

  constructor() {
   }

  ngOnInit() {
  }

}
