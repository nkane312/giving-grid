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
  private months = [
    {value: '01', viewValue: ' 1: January'},
    {value: '02', viewValue: ' 2: February'},
    {value: '03', viewValue: ' 3: March'},
    {value: '04', viewValue: ' 4: April'},
    {value: '05', viewValue: ' 5: May'},
    {value: '06', viewValue: ' 6: June'},
    {value: '07', viewValue: ' 7: July'},
    {value: '08', viewValue: ' 8: August'},
    {value: '09', viewValue: ' 9: September'},
    {value: '10', viewValue: '10: October'},
    {value: '11', viewValue: '11: November'},
    {value: '12', viewValue: '12: December'}
  ]
  private years;
  private setYears = function(){
    var y = []; 
    var d = new Date();
    var i = 0;
    while (i < 10){
      y.push(d.getFullYear() + i);
      i += 1;
    }
    return y;
  };
  
  constructor() {
    this.years = this.setYears();
  }
  private _paymentMethod = 'card';

  private setPaymentMethod (type){
    switch(type){
      case 'card':
        this._paymentMethod = type;
        break;
      case 'ach': 
        this._paymentMethod = type;
        break;
      case 'paypal':
        this._paymentMethod = type;
        break;
      default:
        break;
    }
    
  };

  private getPaymentMethod(){
    return this._paymentMethod;
  }

  ngOnInit() {
  }

}
