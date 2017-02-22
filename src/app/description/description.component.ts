import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css'],
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
export class DescriptionComponent implements OnInit {
  @Input() totalState;
  @Input() description;
  @Input() headline;
  private finish = false;
  private descriptionDone() {
    this.finish = true;
    this.done.emit(this.finish);
  }
  @Output() done = new EventEmitter();

  
  constructor() { }

  ngOnInit() {
  }

}
