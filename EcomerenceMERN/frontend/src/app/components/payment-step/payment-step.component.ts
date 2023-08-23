import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { trigger, transition, style, animate } from '@angular/animations';
import {MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CartService} from "../../services/cart.service";
import {NgxSpinnerService} from "ngx-spinner";
import {mobile} from "../../app.component";
export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0 })),
  ]),
]);
function getCardType(cardNumber: string): string {
  if (/^4\d{15}$/.test(cardNumber)) {
    return "Visa";
  } else if (/^5\d{15}$/.test(cardNumber)) {
    return "Mastercard";
  } else if (/^3[47]\d{13}$/.test(cardNumber)) {
    return "American Express (Amex)";
  } else {
    return "Unknown";
  }
}
@Component({
  selector: 'app-payment-step',
  templateUrl: './payment-step.component.html',
  styleUrls: ['./payment-step.component.scss'],
  animations: [fadeInOutAnimation], // Add the animation here

})

export class PaymentStepComponent {
  closePopup:boolean=false;
  dir:any;
  name:string='';
  cardNumber:string='';
  cvv:string='';
  month:string='';
  year:string='';
  spinnerType:any;
  lan:any = JSON.parse(localStorage.getItem('lan') as any);
  selectedDate:any;
  constructor(public translate:TranslateService, private cartService: CartService,private toast: ToastrService,              private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<PaymentStepComponent>) {
    translate.addLangs(['en', 'he']);
    this.spinnerType ='ball-clip-rotate-pulse';
    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
  }
  switchLang(lang:string)
  {
    this.translate.use(lang)
  }
  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(2, );
    });
  }
  makePayment()
  {
    // check card number length
    if(this.cardNumber.toString().length!=12)
    {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="Invalid card number"
        type="ERROR"
      }
      else{
        str="מספר כרטיס אינו תקין"
        type="שגיאה"
      }
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    // check name  length
    if(this.name.toString().length==0)
    {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="Please enter a name"
        type="ERROR"
      }
      else{
        str="אנא הכנס שם מלא"
        type="שגיאה"
      }
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    // check month  length
    if(this.month.toString().length!=2)
    {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="Invalid month number"
        type="ERROR"
      }
      else{
        str="חודש אינו תקין"
        type="שגיאה"
      }
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    // check year  length
    if(this.year.toString().length!=4)
    {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="Invalid year number"
        type="ERROR"
      }
      else{
        str="שנה אינה תקינה"
        type="שגיאה"
      }
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    // check year  length
    if(this.cvv.toString().length!=3)
    {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="Invalid CVV number"
        type="ERROR"
      }
      else{
        str="מספר CVV אינו תקין"
        type="שגיאה"
      }
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    else{
      this.onCheckout()
      this.closeDialog()
    }
  }
  ngDoCheck(){
    this.lan = JSON.parse(localStorage.getItem('lan') as any);
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    if(this.dir=="rtl"){
      this.switchLang('he')
    }
    else{
      this.switchLang('en')
    }
  }
  ngOnInit(): void {
    this.dir = JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
  }
  closeDialog(){


    this.closePopup = true;
    // sengind event that dialog closed
    this.dialogRef.close('closed');
  }

  protected readonly mobile = mobile;
}
