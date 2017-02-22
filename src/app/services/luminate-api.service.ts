import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LuminateApi {
  private donateApiEndpoint = 'https://secure.ifcj.org/site/CRDonationAPI';
  private apiKey = 'convioAPIFromis7';
  private v = '1.0';
  
  private headers = new Headers(
    {
      'Content-type': 'application/x-www-form-urlencoded',
    }
  );
  private creditFields = {
    method: 'donate',
    card_cvv: undefined,
    card_exp_date_month: undefined,
    card_exp_date_year: undefined,
    card_number: undefined,
  }
  private achFields = {
    method: 'donate',
    ach_account: undefined,
    ach_account_type: undefined,
    ach_routing: undefined
  }
  private paypalFields = {
    method: 'startDonation',
    extproc: 'paypal'
  }
  private standardFields = {
    api_key: this.apiKey,
    v: this.v,
    response_format: 'json',
    'billing.address.street': undefined,
    'billing.address.city': undefined,
    'billing.address.zip': undefined,
    'billing.address.state': undefined,
    'billing.address.country': undefined,
    'billing.address.first': undefined,
    'billing.address.last': undefined,
    'donor.email': undefined,
    'donor.phone': undefined,
    form_id: undefined,
    level_id: undefined,
    df_preview: undefined
  }

  constructor(private http: Http){
  }

  public sendRequest(data, meta){
    console.log(data);
    console.log(meta);
    var body;
    this.standardFields['billing.address.street'] = data.details.street;
    this.standardFields['billing.address.city'] = data.details.city;
    this.standardFields['billing.address.zip'] = data.details.zip;
    this.standardFields['billing.address.state'] = data.details.state;
    this.standardFields['billing.address.country'] = data.details.country;
    this.standardFields['billing.address.first'] = data.details.first;
    this.standardFields['billing.address.last'] = data.details.last;
    this.standardFields['donor.email'] = data.details.email;
    this.standardFields.form_id = meta.dfId;
    this.standardFields.level_id = meta.lvlId;
    if (data.details.phone){
      this.standardFields['donor.phone'] = data.details.phone;
    }
    switch (meta.paymentType) {
      case 'credit':
        this.creditFields.card_cvv = data.payment.credit.cvv;
        this.creditFields.card_exp_date_month = data.payment.credit.expMonth;
        this.creditFields.card_exp_date_year = data.payment.credit.expYear;
        this.creditFields.card_number = data.payment.credit.number;
        body = Object.assign(this.standardFields, this.creditFields);
        break;

      case 'ach':
        this.achFields.ach_account = data.payment.ach.account;
        this.achFields.ach_account_type = data.payment.ach.accountType;
        this.achFields.ach_routing = data.payment.ach.routing;
        body = Object.assign(this.standardFields, this.achFields);
        break;

      case 'paypal':
        body = Object.assign(this.standardFields);
        break;

      default:
        console.log(`Type invalid: ${meta.paymentType}`);
        break;
    }
    console.log(body);
    return this.http.post(this.donateApiEndpoint, body, this.headers);
  }
}

