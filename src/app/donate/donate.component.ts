import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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
  private donate: DonateForm;
  constructor(private http: Http) {
    this.donate = new DonateForm(
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
        paymentType: 'credit',
        credit: {
          number: new FormControl('', [Validators.required, Validators.pattern('[0-9 ()-.]+')]),
          cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9 ()-.]+')]),
          expMonth: new FormControl('', Validators.required),
          expYear: new FormControl('', Validators.required)
        },
        ach: {
          routing: new FormControl('', [Validators.required, Validators.pattern('[0-9 ()-.]+')]),
          account: new FormControl('', [Validators.required, Validators.pattern('[0-9 ()-.]+')]),
          type: new FormControl('', Validators.required)
        }
      }
    );
    this.years = this.setYears();
  }

  private _isMobile: boolean;
  private showMobile(show: boolean){
    this._isMobile = show;
  }

  private error = false;
  private onSubmit({value, valid}: {value: DonateForm, valid: boolean}){
    this.donate.validate();
    if (valid){
      var lumApi = new LuminateAPI(this.http);
      lumApi.postDonate(value, this.donate.payment.paymentType);
    }
  }

  ngOnInit() {
    this.donate.setPaymentMethod('credit');
  }

}

export class LuminateAPI {
  private donateApiEndpoint = 'https://secure2.convio.net/ifcj/site/CRDonationAPI';
  private apiKey = 'convioAPIFromis7';
  private v = '1.0';
  
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  private donateFields = {
    method: 'donate',
    api_key: this.apiKey,
    v: this.v,
    response_format: 'json',
    'billing.address.street': undefined,
    'billing.address.city': undefined,
    'billing.address.zip': undefined,
    'billing.address.first': undefined,
    'billing.address.last': undefined,
    'donor.email': undefined,
    form_id: undefined,
    level_id: undefined,
    card_cvv: undefined,
    card_exp_date_month: undefined,
    card_exp_date_year: undefined,
    card_number: undefined
  }
  constructor(private http: Http){
  }



  public postDonate(data, type){
    console.log(data);
    var body;
    switch (type) {
      case 'credit':
        data.
        break;

      case 'ach':
        break;

      case 'paypal':
        break;

      default:
        break;
    }
    //return this.http.post(this.donateApiEndpoint, data, this.headers);
  }
  public postStartDonate(data){

  }
}

export class DonateForm {
  public master: FormGroup;
  public creditGroup: FormGroup;
  public achGroup: FormGroup;
  public detailsGroup: FormGroup;

  constructor(public details, public payment){

    this.creditGroup = new FormGroup({
      number: this.payment.credit.number,
      cvv: this.payment.credit.cvv,
      expMonth: this.payment.credit.expMonth,
      expYear: this.payment.credit.expYear
    });
    this.achGroup = new FormGroup({
      routing: this.payment.ach.routing,
      account: this.payment.ach.account,
      type: this.payment.ach.type
    });

    this.detailsGroup = new FormGroup({
      first: this.details.first,
      last: this.details.last,
      street: this.details.street,
      city: this.details.city,
      zip: this.details.zip,
      state: this.details.state,
      country: this.details.country,
      phone: this.details.phone,
      email: this.details.email,
    });

    this.master = new FormGroup({
      details: this.detailsGroup,
      payment: new FormGroup({
        credit: this.creditGroup,
        ach: this.achGroup
      })
    });
  }

  public validate(): boolean{
    var isValid = true;
    for (let detail in this.details){
      if(this.details.hasOwnProperty(detail)){
        this.details[detail].markAsDirty();
        this.details[detail].markAsTouched();
        if(!this.details[detail].valid){
          isValid = false;
        }
      }
    }
    if (this._paymentMethod === 'credit'){
      for (let prop in this.payment.credit){
        if(this.payment.credit.hasOwnProperty(prop)){
          this.payment.credit[prop].markAsDirty();
          this.payment.credit[prop].markAsTouched();
          if(!this.payment.credit[prop].valid){
            isValid = false;
          }
        }
      }
    }
    else if(this._paymentMethod === 'ach'){
      for (let prop in this.payment.ach){
        if(this.payment.ach.hasOwnProperty(prop)){
          this.payment.ach[prop].markAsDirty();
          this.payment.ach[prop].markAsTouched();
          if(!this.payment.ach[prop].valid){
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  private _paymentMethod: string;
  public setPaymentMethod (type){
    switch(type){
      case 'credit':
        this._paymentMethod = type;
        this.creditGroup.enable();
        this.achGroup.disable();
        break;
      case 'ach': 
        this._paymentMethod = type;
        this.creditGroup.disable();
        this.achGroup.enable();
        break;
      case 'paypal':
        this.creditGroup.disable();
        this.achGroup.disable();
        this._paymentMethod = type;
        break;
      default:
        break;
    }
  };

  public getPaymentMethod(){
    return this._paymentMethod;
  }
}
export interface PaymentInfo {
  paymentType: string;
  credit: {
    number: number;
    cvv: number;
    expMonth: number;
    expYear: number;
  }
  ach: {
    routing: number;
    account: number;
    type: string;
  }
}