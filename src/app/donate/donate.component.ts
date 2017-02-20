import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var luminateExtend:any;

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  @Input() total;
  @Input() dfId;
  @Input() totalState;
  @Output() donating = new EventEmitter();

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

  private donateControls = new Donate(
    {
      first: new FormControl('', Validators.required),
      last: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zip: new FormControl('', [Validators.required, Validators.pattern('[0-9 -.]+')]),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.pattern('[0-9 ()-.]+')),
      email: new FormControl('', [Validators.required, Validators.pattern('')])
    },
    {
      paymentType: 'card',
      card: {
        number: new FormControl('', [Validators.required, Validators.pattern('[0-9\-\ ]')]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9\-\ ]')]),
        expMonth: new FormControl('', Validators.required),
        expYear: new FormControl('', Validators.required)
      },
      ach: {
        routing: new FormControl('', [Validators.required, Validators.pattern('[0-9\-\ ]')]),
        account: new FormControl('', [Validators.required, Validators.pattern('[0-9\-\ ]')])
      }
    }
  );

  private creditCardPayment = new FormGroup({
    number: this.donateControls.payment.card.number,
    cvv: this.donateControls.payment.card.cvv,
    expMonth: this.donateControls.payment.card.expMonth,
    expYear: this.donateControls.payment.card.expYear
  });
  private achPayment = new FormGroup({
    routing: this.donateControls.payment.ach.routing,
    account: this.donateControls.payment.ach.account
  });

  private details = new FormGroup({
    first: this.donateControls.details.first,
    last: this.donateControls.details.last,
    street: this.donateControls.details.street,
    city: this.donateControls.details.city,
    zip: this.donateControls.details.zip,
    state: this.donateControls.details.state,
    country: this.donateControls.details.country,
    phone: this.donateControls.details.phone,
    email: this.donateControls.details.email,
  });
  private donate = new FormGroup({
    details: this.details,
    payment: new FormGroup({
      credit: this.creditCardPayment,
      ach: this.achPayment
    })
  });
  private error = false;
  private onSubmit({value, valid}: {value: Donate, valid: boolean}){
    console.log(value);
    console.log(valid);
    console.log(this.donateControls);
    console.log(this.donateControls.validate());
  }

  ngOnInit() {
    this.setPaymentMethod('card');
  }

}
export class Donate {
  constructor(public details, public payment){}
  public validate(): boolean{
    var isValid = true;
    for (let detail in this.details){
      console.log(detail);
      if(this.details.hasOwnProperty(detail)){
        this.details[detail].markAsDirty();
        this.details[detail].markAsTouched();
        if(!this.details[detail].valid){
          isValid = false;
        }
      }
    }
    if (this.payment.type === 'card'){
      for (let prop in this.payment.card){
        if(this.payment.card.hasOwnProperty(prop)){
          this.payment.card.prop.markAsDirty();
          if(!this.payment.card.prop.valid){
            isValid = false;
          }
        }
      }
    }
    else if(this.payment.type === 'ach'){
      for (let prop in this.payment.ach){
        if(this.payment.ach.hasOwnProperty(prop)){
          this.payment.ach.prop.markAsDirty();
          if(!this.payment.ach.prop.valid){
            isValid = false;
          }
        }
      }
    }
    return isValid;
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