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
  @Input() infoState;
  @Output() donating = new EventEmitter();
  @Output() paypal = new EventEmitter();


  private showInfo(){
      this.infoState = true;
  }
  private infoClosed(e){
      this.infoState = e;
  }


  private finish = false;
  private done() {
    if (this.totalState === true) {
      this.finish = true;
    } else {
      this.finish = false;
    }
  }

  private states = [
    {value:'AK', viewValue: 'Alaska'},
    {value:'AL', viewValue: 'Alabama'},
    {value:'AR', viewValue: 'Arkansas'},
    {value:'AZ', viewValue: 'Arizona'},
    {value:'CA', viewValue: 'California'},
    {value:'CO', viewValue: 'Colorado'},
    {value:'CT', viewValue: 'Connecticut'},
    {value:'DC', viewValue: 'District of Columbia'},
    {value:'DE', viewValue: 'Delaware'},
    {value:'FL', viewValue: 'Florida'},
    {value:'GA', viewValue: 'Georgia'},
    {value:'HI', viewValue: 'Hawaii'},
    {value:'IA', viewValue: 'Iowa'},
    {value:'ID', viewValue: 'Idaho'},
    {value:'IL', viewValue: 'Illinois'},
    {value:'IN', viewValue: 'Indiana'},
    {value:'KS', viewValue: 'Kansas'},
    {value:'KY', viewValue: 'Kentucky'},
    {value:'LA', viewValue: 'Louisiana'},
    {value:'MA', viewValue: 'Massachusetts'},
    {value:'MD', viewValue: 'Maryland'},
    {value:'ME', viewValue: 'Maine'},
    {value:'MI', viewValue: 'Michigan'},
    {value:'MN', viewValue: 'Minnesota'},
    {value:'MO', viewValue: 'Missouri'},
    {value:'MS', viewValue: 'Mississippi'},
    {value:'MT', viewValue: 'Montana'},
    {value:'NC', viewValue: 'North Carolina'},
    {value:'ND', viewValue: 'North Dakota'},
    {value:'NE', viewValue: 'Nebraska'},
    {value:'NH', viewValue: 'New Hampshire'},
    {value:'NJ', viewValue: 'New Jersey'},
    {value:'NM', viewValue: 'New Mexico'},
    {value:'NV', viewValue: 'Nevada'},
    {value:'NY', viewValue: 'New York'},
    {value:'OH', viewValue: 'Ohio'},
    {value:'OK', viewValue: 'Oklahoma'},
    {value:'OR', viewValue: 'Oregon'},
    {value:'PA', viewValue: 'Pennsylvania'},
    {value:'RI', viewValue: 'Rhode Island'},
    {value:'SC', viewValue: 'South Carolina'},
    {value:'SD', viewValue: 'South Dakota'},
    {value:'TN', viewValue: 'Tennessee'},
    {value:'TX', viewValue: 'Texas'},
    {value:'UT', viewValue: 'Utah'},
    {value:'VA', viewValue: 'Virginia'},
    {value:'VT', viewValue: 'Vermont'},
    {value:'WA', viewValue: 'Washington'},
    {value:'WI', viewValue: 'Wisconsin'},
    {value:'WV', viewValue: 'West Virginia'},
    {value:'WY', viewValue: 'Wyoming'},
    {value:'AS', viewValue: 'American Samoa'},
    {value:'FM', viewValue: 'Federated States of Micronesia'},
    {value:'GU', viewValue: 'Guam'},
    {value:'MH', viewValue: 'Marshall Islands'},
    {value:'MP', viewValue: 'Northern Mariana Islands'},
    {value:'PR', viewValue: 'Puerto Rico'},
    {value:'PW', viewValue: 'Palau'},
    {value:'VI', viewValue: 'Virgin Islands'},
    {value:'AA', viewValue: 'Armed Forces Americas'},
    {value:'AE', viewValue: 'Armed Forces'},
    {value:'AP', viewValue: 'Armed Forces Pacific'},
    {value:'AB', viewValue: 'Alberta'},
    {value:'BC', viewValue: 'British Columbia'},
    {value:'MB', viewValue: 'Manitoba'},
    {value:'NB', viewValue: 'New Brunswick'},
    {value:'NL', viewValue: 'Newfoundland and Labrador'},
    {value:'NS', viewValue: 'Nova Scotia'},
    {value:'NT', viewValue: 'Northwest Territories'},
    {value:'NU', viewValue: 'Nunavut'},
    {value:'ON', viewValue: 'Ontario'},
    {value:'PE', viewValue: 'Prince Edward Island'},
    {value:'QC', viewValue: 'Quebec'},
    {value:'SK', viewValue: 'Saskatchewan'},
    {value:'YT', viewValue: 'Yukon'},
    {value:'None', viewValue: 'None'},
  ];
  private countries = [
    {value:'United States', viewValue: 'United States'},
    {value:'Canada', viewValue: 'Canada'},
    {value:'Afghanistan', viewValue: 'Afghanistan'},
    {value:'Aland Islands', viewValue: 'Aland Islands'},
    {value:'Albania', viewValue: 'Albania'},
    {value:'Algeria', viewValue: 'Algeria'},
    {value:'American Samoa', viewValue: 'American Samoa'},
    {value:'Andorra', viewValue: 'Andorra'},
    {value:'Angola', viewValue: 'Angola'},
    {value:'Anguilla', viewValue: 'Anguilla'},
    {value:'Antarctica', viewValue: 'Antarctica'},
    {value:'Antigua and Barbuda', viewValue: 'Antigua and Barbuda'},
    {value:'Argentina', viewValue: 'Argentina'},
    {value:'Armenia', viewValue: 'Armenia'},
    {value:'Aruba', viewValue: 'Aruba'},
    {value:'Australia', viewValue: 'Australia'},
    {value:'Austria', viewValue: 'Austria'},
    {value:'Azerbaijan', viewValue: 'Azerbaijan'},
    {value:'Bahamas', viewValue: 'Bahamas'},
    {value:'Bahrain', viewValue: 'Bahrain'},
    {value:'Bangladesh', viewValue: 'Bangladesh'},
    {value:'Barbados', viewValue: 'Barbados'},
    {value:'Belarus', viewValue: 'Belarus'},
    {value:'Belgium', viewValue: 'Belgium'},
    {value:'Belize', viewValue: 'Belize'},
    {value:'Benin', viewValue: 'Benin'},
    {value:'Bermuda', viewValue: 'Bermuda'},
    {value:'Bhutan', viewValue: 'Bhutan'},
    {value:'Bolivarian Republic of Venezuela', viewValue: 'Bolivarian Republic of Venezuela'},
    {value:'Bonaire, Sint Eustatios and Saba', viewValue: 'Bonaire, Sint Eustatios and Saba'},
    {value:'Bosnia and Herzegovina', viewValue: 'Bosnia and Herzegovina'},
    {value:'Botswana', viewValue: 'Botswana'},
    {value:'Bouvet Island', viewValue: 'Bouvet Island'},
    {value:'Brazil', viewValue: 'Brazil'},
    {value:'British Indian Ocean Territory', viewValue: 'British Indian Ocean Territory'},
    {value:'Brunei Darussalam', viewValue: 'Brunei Darussalam'},
    {value:'Bulgaria', viewValue: 'Bulgaria'},
    {value:'Burkina Faso', viewValue: 'Burkina Faso'},
    {value:'Burundi', viewValue: 'Burundi'},
    {value:'Cambodia', viewValue: 'Cambodia'},
    {value:'Cameroon', viewValue: 'Cameroon'},
    {value:'Cape Verde', viewValue: 'Cape Verde'},
    {value:'Cayman Islands', viewValue: 'Cayman Islands'},
    {value:'Central African Republic', viewValue: 'Central African Republic'},
    {value:'Chad', viewValue: 'Chad'},
    {value:'Chile', viewValue: 'Chile'},
    {value:'China', viewValue: 'China'},
    {value:'Christmas Island', viewValue: 'Christmas Island'},
    {value:'Cocos (Keeling) Islands', viewValue: 'Cocos (Keeling) Islands'},
    {value:'Colombia', viewValue: 'Colombia'},
    {value:'Comoros', viewValue: 'Comoros'},
    {value:'Congo', viewValue: 'Congo'},
    {value:'Cook Islands', viewValue: 'Cook Islands'},
    {value:'Costa Rica', viewValue: 'Costa Rica'},
    {value:'Cote D’Ivoire', viewValue: 'Cote D’Ivoire'},
    {value:'Croatia', viewValue: 'Croatia'},
    {value:'Cuba', viewValue: 'Cuba'},
    {value:'Curacao', viewValue: 'Curacao'},
    {value:'Cyprus', viewValue: 'Cyprus'},
    {value:'Czech Republic', viewValue: 'Czech Republic'},
    {value:'Democratic People’s Republic of Korea', viewValue: 'Democratic People’s Republic of Korea'},
    {value:'The Democratic Republic of the Congo', viewValue: 'The Democratic Republic of the Congo'},
    {value:'Denmark', viewValue: 'Denmark'},
    {value:'Djibouti', viewValue: 'Djibouti'},
    {value:'Dominica', viewValue: 'Dominica'},
    {value:'Dominican Republic', viewValue: 'Dominican Republic'},
    {value:'Ecuador', viewValue: 'Ecuador'},
    {value:'Egypt', viewValue: 'Egypt'},
    {value:'El Salvador', viewValue: 'El Salvador'},
    {value:'Equatorial Guinea', viewValue: 'Equatorial Guinea'},
    {value:'Eritrea', viewValue: 'Eritrea'},
    {value:'Estonia', viewValue: 'Estonia'},
    {value:'Ethiopia', viewValue: 'Ethiopia'},
    {value:'Falkland Islands (Malvinas)', viewValue: 'Falkland Islands (Malvinas)'},
    {value:'Faroe Islands', viewValue: 'Faroe Islands'},
    {value:'Federated States of Micronesia', viewValue: 'Federated States of Micronesia'},
    {value:'Fiji', viewValue: 'Fiji'},
    {value:'Finland', viewValue: 'Finland'},
    {value:'The Former Yugoslav Republic of Macedonia', viewValue: 'The Former Yugoslav Republic of Macedonia'},
    {value:'France', viewValue: 'France'},
    {value:'French Guiana', viewValue: 'French Guiana'},
    {value:'French Polynesia', viewValue: 'French Polynesia'},
    {value:'French Southern Territories', viewValue: 'French Southern Territories'},
    {value:'Gabon', viewValue: 'Gabon'},
    {value:'Gambia', viewValue: 'Gambia'},
    {value:'Georgia', viewValue: 'Georgia'},
    {value:'Germany', viewValue: 'Germany'},
    {value:'Ghana', viewValue: 'Ghana'},
    {value:'Gibraltar', viewValue: 'Gibraltar'},
    {value:'Greece', viewValue: 'Greece'},
    {value:'Greenland', viewValue: 'Greenland'},
    {value:'Grenada', viewValue: 'Grenada'},
    {value:'Guadeloupe', viewValue: 'Guadeloupe'},
    {value:'Guam', viewValue: 'Guam'},
    {value:'Guatemala', viewValue: 'Guatemala'},
    {value:'Guernsey', viewValue: 'Guernsey'},
    {value:'Guinea', viewValue: 'Guinea'},
    {value:'Guinea-Bissau', viewValue: 'Guinea-Bissau'},
    {value:'Guyana', viewValue: 'Guyana'},
    {value:'Haiti', viewValue: 'Haiti'},
    {value:'Heard Island and McDonald Islands', viewValue: 'Heard Island and McDonald Islands'},
    {value:'Holy See (Vatican City State)', viewValue: 'Holy See (Vatican City State)'},
    {value:'Honduras', viewValue: 'Honduras'},
    {value:'Hong Kong', viewValue: 'Hong Kong'},
    {value:'Hungary', viewValue: 'Hungary'},
    {value:'Iceland', viewValue: 'Iceland'},
    {value:'India', viewValue: 'India'},
    {value:'Indonesia', viewValue: 'Indonesia'},
    {value:'Iraq', viewValue: 'Iraq'},
    {value:'Ireland', viewValue: 'Ireland'},
    {value:'Islamic Republic of Iran', viewValue: 'Islamic Republic of Iran'},
    {value:'Isle of Man', viewValue: 'Isle of Man'},
    {value:'Israel', viewValue: 'Israel'},
    {value:'Italy', viewValue: 'Italy'},
    {value:'Jamaica', viewValue: 'Jamaica'},
    {value:'Japan', viewValue: 'Japan'},
    {value:'Jersey', viewValue: 'Jersey'},
    {value:'Jordan', viewValue: 'Jordan'},
    {value:'Kazakhstan', viewValue: 'Kazakhstan'},
    {value:'Kenya', viewValue: 'Kenya'},
    {value:'Kiribati', viewValue: 'Kiribati'},
    {value:'Kuwait', viewValue: 'Kuwait'},
    {value:'Kyrgyzstan', viewValue: 'Kyrgyzstan'},
    {value:'Laos People’s Democratic Republic', viewValue: 'Laos People’s Democratic Republic'},
    {value:'Latvia', viewValue: 'Latvia'},
    {value:'Lebanon', viewValue: 'Lebanon'},
    {value:'Lesotho', viewValue: 'Lesotho'},
    {value:'Liberia', viewValue: 'Liberia'},
    {value:'Libya', viewValue: 'Libya'},
    {value:'Liechtenstein', viewValue: 'Liechtenstein'},
    {value:'Lithuania', viewValue: 'Lithuania'},
    {value:'Luxembourg', viewValue: 'Luxembourg'},
    {value:'Macao', viewValue: 'Macao'},
    {value:'Madagascar', viewValue: 'Madagascar'},
    {value:'Malawi', viewValue: 'Malawi'},
    {value:'Malaysia', viewValue: 'Malaysia'},
    {value:'Maldives', viewValue: 'Maldives'},
    {value:'Mali', viewValue: 'Mali'},
    {value:'Malta', viewValue: 'Malta'},
    {value:'Marshall Islands', viewValue: 'Marshall Islands'},
    {value:'Martinique', viewValue: 'Martinique'},
    {value:'Mauritania', viewValue: 'Mauritania'},
    {value:'Mauritius', viewValue: 'Mauritius'},
    {value:'Mayotte', viewValue: 'Mayotte'},
    {value:'Mexico', viewValue: 'Mexico'},
    {value:'Monaco', viewValue: 'Monaco'},
    {value:'Mongolia', viewValue: 'Mongolia'},
    {value:'Montenegro', viewValue: 'Montenegro'},
    {value:'Montserrat', viewValue: 'Montserrat'},
    {value:'Morocco', viewValue: 'Morocco'},
    {value:'Mozambique', viewValue: 'Mozambique'},
    {value:'Myanmar', viewValue: 'Myanmar'},
    {value:'Namibia', viewValue: 'Namibia'},
    {value:'Nauru', viewValue: 'Nauru'},
    {value:'Nepal', viewValue: 'Nepal'},
    {value:'Netherlands', viewValue: 'Netherlands'},
    {value:'New Caledonia', viewValue: 'New Caledonia'},
    {value:'New Zealand', viewValue: 'New Zealand'},
    {value:'Nicaragua', viewValue: 'Nicaragua'},
    {value:'Niger', viewValue: 'Niger'},
    {value:'Nigeria', viewValue: 'Nigeria'},
    {value:'Niue', viewValue: 'Niue'},
    {value:'Norfolk Island', viewValue: 'Norfolk Island'},
    {value:'Northern Mariana Islands', viewValue: 'Northern Mariana Islands'},
    {value:'Norway', viewValue: 'Norway'},
    {value:'Oman', viewValue: 'Oman'},
    {value:'Pakistan', viewValue: 'Pakistan'},
    {value:'Palau', viewValue: 'Palau'},
    {value:'Palestinian Territory, Occupied', viewValue: 'Palestinian Territory, Occupied'},
    {value:'Panama', viewValue: 'Panama'},
    {value:'Papua New Guinea', viewValue: 'Papua New Guinea'},
    {value:'Paraguay', viewValue: 'Paraguay'},
    {value:'Peru', viewValue: 'Peru'},
    {value:'Philippines', viewValue: 'Philippines'},
    {value:'Pitcairn', viewValue: 'Pitcairn'},
    {value:'Plurinational State of Bolivia', viewValue: 'Plurinational State of Bolivia'},
    {value:'Poland', viewValue: 'Poland'},
    {value:'Portugal', viewValue: 'Portugal'},
    {value:'Puerto Rico', viewValue: 'Puerto Rico'},
    {value:'Qatar', viewValue: 'Qatar'},
    {value:'Republic of Korea', viewValue: 'Republic of Korea'},
    {value:'Republic of Moldova', viewValue: 'Republic of Moldova'},
    {value:'Reunion', viewValue: 'Reunion'},
    {value:'Romania', viewValue: 'Romania'},
    {value:'Russian Federation', viewValue: 'Russian Federation'},
    {value:'Rwanda', viewValue: 'Rwanda'},
    {value:'Saint Barthelemy', viewValue: 'Saint Barthelemy'},
    {value:'Saint Helena, Ascension and Tristan da Cunha', viewValue: 'Saint Helena, Ascension and Tristan da Cunha'},
    {value:'Saint Kitts and Nevis', viewValue: 'Saint Kitts and Nevis'},
    {value:'Saint Lucia', viewValue: 'Saint Lucia'},
    {value:'Saint Martin (French)', viewValue: 'Saint Martin (French)'},
    {value:'Saint Pierre and Miquelon', viewValue: 'Saint Pierre and Miquelon'},
    {value:'Saint Vincent and the Grenadines', viewValue: 'Saint Vincent and the Grenadines'},
    {value:'Samoa', viewValue: 'Samoa'},
    {value:'San Marino', viewValue: 'San Marino'},
    {value:'Sao Tome and Principe', viewValue: 'Sao Tome and Principe'},
    {value:'Saudi Arabia', viewValue: 'Saudi Arabia'},
    {value:'Senegal', viewValue: 'Senegal'},
    {value:'Serbia', viewValue: 'Serbia'},
    {value:'Seychelles', viewValue: 'Seychelles'},
    {value:'S. Georgia &amp; S. Sandwich Isls.', viewValue: 'S. Georgia &amp; S. Sandwich Isls.'},
    {value:'Sierra Leone', viewValue: 'Sierra Leone'},
    {value:'Singapore', viewValue: 'Singapore'},
    {value:'Sint Maarten (Dutch)', viewValue: 'Sint Maarten (Dutch)'},
    {value:'Slovakia', viewValue: 'Slovakia'},
    {value:'Slovenia', viewValue: 'Slovenia'},
    {value:'Solomon Islands', viewValue: 'Solomon Islands'},
    {value:'Somalia', viewValue: 'Somalia'},
    {value:'South Africa', viewValue: 'South Africa'},
    {value:'South Sudan', viewValue: 'South Sudan'},
    {value:'Spain', viewValue: 'Spain'},
    {value:'Sri Lanka', viewValue: 'Sri Lanka'},
    {value:'Sudan', viewValue: 'Sudan'},
    {value:'Suriname', viewValue: 'Suriname'},
    {value:'Svalbard and Jan Mayen', viewValue: 'Svalbard and Jan Mayen'},
    {value:'Swaziland', viewValue: 'Swaziland'},
    {value:'Sweden', viewValue: 'Sweden'},
    {value:'Switzerland', viewValue: 'Switzerland'},
    {value:'Syrian Arab Republic', viewValue: 'Syrian Arab Republic'},
    {value:'Taiwan, Province of China', viewValue: 'Taiwan, Province of China'},
    {value:'Tajikistan', viewValue: 'Tajikistan'},
    {value:'Thailand', viewValue: 'Thailand'},
    {value:'Timor-Leste', viewValue: 'Timor-Leste'},
    {value:'Togo', viewValue: 'Togo'},
    {value:'Tokelau', viewValue: 'Tokelau'},
    {value:'Tonga', viewValue: 'Tonga'},
    {value:'Trinidad and Tobago', viewValue: 'Trinidad and Tobago'},
    {value:'Tunisia', viewValue: 'Tunisia'},
    {value:'Turkey', viewValue: 'Turkey'},
    {value:'Turkmenistan', viewValue: 'Turkmenistan'},
    {value:'Turks and Caicos Islands', viewValue: 'Turks and Caicos Islands'},
    {value:'Tuvalu', viewValue: 'Tuvalu'},
    {value:'Uganda', viewValue: 'Uganda'},
    {value:'Ukraine', viewValue: 'Ukraine'},
    {value:'United Arab Emirates', viewValue: 'United Arab Emirates'},
    {value:'United Kingdom', viewValue: 'United Kingdom'},
    {value:'United Republic of Tanzania', viewValue: 'United Republic of Tanzania'},
    {value:'Uruguay', viewValue: 'Uruguay'},
    {value:'USA Minor Outlying Islands', viewValue: 'USA Minor Outlying Islands'},
    {value:'Uzbekistan', viewValue: 'Uzbekistan'},
    {value:'Vanuatu', viewValue: 'Vanuatu'},
    {value:'Viet Nam', viewValue: 'Viet Nam'},
    {value:'Virgin Islands (British)', viewValue: 'Virgin Islands (British)'},
    {value:'Virgin Islands (USA)', viewValue: 'Virgin Islands (USA)'},
    {value:'Wallis and Futuna', viewValue: 'Wallis and Futuna'},
    {value:'Western Sahara', viewValue: 'Western Sahara'},
    {value:'Yemen', viewValue: 'Yemen'},
    {value:'Zambia', viewValue: 'Zambia'},
    {value:'Zimbabwe', viewValue: 'Zimbabwe'},
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
      },
    );
    this.years = this.setYears();
  }

  private _isMobile: boolean;
  private showMobile(show: boolean){
    this._isMobile = show;
  }

  private sessionRequest;
  private session = { 
    id: undefined,
    token: undefined
  }
  private donateRequest;
  private formSub = false;
  private onSubmit({value, valid}: {value: DonateForm, valid: boolean}){
    this.paypal.emit();
    this.donate.validate();
    this.formSub = true;
    if (valid && this.total >= 5){
      this.sessionRequest = this.luminateApi.getLuminateSession();
      this.sessionRequest.subscribe(
      data => {
          console.log('success');
          this.disableSubmit();
          var body = JSON.parse(data._body);
          if (body.getLoginUrlResponse) {
            this.session.token = body.getLoginUrlResponse.token;
            this.session.id = body.getLoginUrlResponse.JSESSIONID;
          }          
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
      this.sendDonationRequest(value)     
    }
  }

  private sendDonationRequest(value){
    this.donateRequest = this.luminateApi.sendRequest(value, {type: this.donate.getPaymentMethod(), amount: this.total, dfId: this.dfId, lvlId: this.lvlId});
        console.log(this.donateRequest);
        this.donateRequest.subscribe(
          data => {
            console.log('success');
            this.disableSubmit();
            
            var body = JSON.parse(data._body);
            
            if (body.donationResponse.redirect) {
              window.location.href = body.donationResponse.redirect.url;
              
            }

            if (body.donationResponse.donation) {
              this.donating.emit();
              this.showMobile(false);
            }
          },
          err => {
            console.log('error');
            console.log(err);
            if(err._body.includes('CARD_DECLINED')) {
              alert('Error: The credit card entered was declined. \nPlease check the information that you entered.');
            }
          },
          complete => {
            console.log('complete');
            console.log(complete);
          }
        );
  }
  private disableSubmit() {
    if ('#donate') {
      document.getElementById('donate').setAttribute('disabled', 'disabled');
    setTimeout(function() {
      document.getElementById('donate').removeAttribute('disabled');
      }, 1500);
    } else if ('#mobile-donate') {
      document.getElementById('mobile-donate').setAttribute('disabled', 'disabled');
      setTimeout(function() {
      document.getElementById('mobile-donate').removeAttribute('disabled');
      }, 1500);
    }
  }
  ngOnInit() {
    this.donate.setPaymentMethod('credit');
  }
  ngOnChanges() {
  }
  private mobileDonate() {
    
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