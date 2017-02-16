import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var luminateExtend:any;

declare var dataLayer: any;

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
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
export class DonateComponent implements OnInit {
  @Input() total;
  @Input() dfId;
  @Input() totalState;
  @Output() donating = new EventEmitter();

  private finish = false;
  private done() {
    if (this.totalState === true) {
      this.finish = true;
    } else {
      this.finish = false;
    }
  }

  private donateApiEndpoint = "https://secure2.convio.net/ifcj/site/CRDonationAPI";
  private apiKey = "convioAPIFromis7";
  private v = "1.0";
  private responseFormat = "json";


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
    {value: '1', viewValue: ' 1: January'},
    {value: '2', viewValue: ' 2: February'},
    {value: '3', viewValue: ' 3: March'},
    {value: '4', viewValue: ' 4: April'},
    {value: '5', viewValue: ' 5: May'},
    {value: '6', viewValue: ' 6: June'},
    {value: '7', viewValue: ' 7: July'},
    {value: '8', viewValue: ' 8: August'},
    {value: '9', viewValue: ' 9: September'},
    {value: '10', viewValue: '10: October'},
    {value: '11', viewValue: '11: November'},
    {value: '12', viewValue: '12: December'}
  ];
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
  private _isMobile: boolean;
  private showMobile(show: boolean){
    this._isMobile = show;
  }

  private creditCardPayment = new FormGroup({
    number: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required),
    expMonth: new FormControl('', Validators.required),
    expYear: new FormControl('', Validators.required)
  });
  private achPayment = new FormGroup({
    routing: new FormControl('', Validators.required),
    account: new FormControl('', Validators.required)
  });
  
  private details = new FormGroup({
    name: new FormGroup({
      first: new FormControl('', Validators.required),
      last: new FormControl('', Validators.required)
    }),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    }),
    contact: new FormGroup({
      phone: new FormControl(''),
      email: new FormControl('', Validators.required)
    })
  });

  private donate = new FormGroup({
    details: this.details,
    payment: new FormGroup({
      credit: this.creditCardPayment,
      ach: this.achPayment
    })
  });
  
  private onSubmit({value, valid}: {value: Donate, valid: boolean}){
    console.log(value);
    console.log(valid);
  }

  ngOnInit() {
  }

}
export interface Donate {
  details: ConsInfo;
  payment: PaymentInfo;
}
export interface ConsInfo {
  name: {
    first: string;
    last: string;
  }
  address: {
    street: string;
    city: string;
    zip: number;
    state: string;
    country: string;
  }
  contact: {
    phone: number;
    email: string;
  }
}
export interface PaymentInfo {
  paymentType: string;
  card: {
    number: number;
    cvv: number;
    expMonth: number;
    expYear: number;
  }
  ach: {
    routing: number;
    account: number;
  }
}