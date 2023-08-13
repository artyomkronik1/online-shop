import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { trigger, transition, style, animate } from '@angular/animations';
import {MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CartService} from "../../services/cart.service";
import {NgxSpinnerService} from "ngx-spinner";
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
  cardNumber:number=0;
  cvv:number=0;
  month:any=null;
  year:any=null;
  spinnerType:any;

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
      this.cartService.CheckoutFromCart(2);
    });
  }
  makePayment()
  {
    if(this.cardNumber.toString().length!=12)
    {
      this.toast.error(`Invalid card number`, 'ERROR', {
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
}
