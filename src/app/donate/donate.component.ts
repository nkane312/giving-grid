import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { DonateForm } from './donate-form.controller';
import { LuminateApi } from '../services/luminate-api.service';

//declare var dataLayer: any;
declare var ga: any;

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
  @Input() lvlId;
  @Input() totalState;
  @Input() headline;
  @Input() description;
  @Output() donating = new EventEmitter();

  private finish = false;
  private done() {
    if (this.totalState === true) {
      this.finish = true;
    } else {
      this.finish = false;
    }
  }

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
  constructor(private luminateApi: LuminateApi) {
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
  private donateRequest;
  private onSubmit({value, valid}: {value: DonateForm, valid: boolean}){
    this.donate.validate();
    if (valid){
      this.donateRequest = this.luminateApi.sendRequest(value, {paymentType: this.donate.payment.paymentType, dfId: this.dfId, lvlId: this.lvlId});
      this.donateRequest.subscribe(
        data => {
          console.log('success');
          console.log(data);
        },
        err => {
          console.log('error');
          console.log(err);
        },
        complete => {
          console.log('complete');
          console.log(complete);
        }
      );
    }
  }

  public testGA() {
    var ga = new EcommerceTransaction({
      transactionId: 'testTransaction2',
      dfId: 12345,
      campaign: 'WOE',
      version: 1
    }, [{
      id: 25,
      name: 'Rect6',
      price: 25,
      quantity: 1,
      category: 'Grid Square'
    },
    {
      id: 50,
      name: 'Rect7',
      price: 50,
      quantity: 1,
      category: 'Grid Square'
    }]);
    ga.pushGAData();
  }
  ngOnInit() {
    this.donate.setPaymentMethod('credit');
  }
  ngOnChanges() {
    console.log(this.description);
  }

}
class EcommerceTransaction {
  public pushGAData() {
    ga('create', 'UA-4133035-40', 'auto');
    ga('require', 'ec');

    this.products.map(function(product){
      ga('ec:addProduct', product);
    });

    ga('ec:setAction', 'purchase', {
      'id': this.transaction.transactionId,
      'affiliation': 'Giving Grid',
      'revenue': this.total,
      'category': this.transaction.campaign,
      'variant': this.transaction.version,
    });

    ga('send', {
      hitType: 'event',
      eventCategory: 'Giving Grid',
      eventAction: 'Donation',
      eventLabel: 'Squares Purchased'
    }); 
  }
  total: number;
  constructor(private transaction: Transaction, private products: Array<Product>){
    products.map(function(product, i, products){
      if (!product.hasOwnProperty('quantity')) {
        products[i].quantity = 1;
      }
    })
    this.total = products.reduce(function(acc, product) {
      return acc + product.price;
    }, 0);
    
  }
}
interface Transaction {
  transactionId: string;
  dfId: number;
  campaign: string;
  version: number;
}
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
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
