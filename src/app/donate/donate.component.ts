import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  @Input() total;
  @Input() dfId;
  @Output() donating = new EventEmitter();

  private states = [
    {value: 'IL', viewValue: 'Illinois'},
    {value: 'NY', viewValue: 'New York'},
    {value: 'ETC', viewValue: 'Etc...'}
  ];
  private countries = [
    {value: 'US', viewValue: 'United States'},
    {value: 'CA', viewValue: 'Canada'},
    {value: 'ETC', viewValue: 'Etc...'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
