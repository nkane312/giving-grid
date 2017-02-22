import { FormControl, FormGroup, Validators } from '@angular/forms';

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
