import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartModelServer} from '../../models/cart-model';
import {TranslateService} from "@ngx-translate/core";
import {DialogBodyComponent} from "../dialog-body/dialog-body.component";
import {MatDialog} from "@angular/material/dialog";
import {PaymentStepComponent} from "../payment-step/payment-step.component";
import { MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})


export class CheckoutComponent  {
  length:any;
  cartTotal: any;
  // billing details
  first_name:string='';
  last_name:string='';
  email:string='';
  addres:string='';
  lan:any = JSON.parse(localStorage.getItem('lan') as any);
  city:string='';
  country:string='';
  phone:string='';
  cartData: any=[{
    total:0,
    data:[],
    wishList:[]
  }];
  spinnerType:any;
  dir:any;
  constructor(public translate:TranslateService,private matDialog:MatDialog, private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService,
  ) {
    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
  }  switchLang(lang:string)
  {
    this.translate.use(lang)
  }

  ngOnInit(): void {
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    this.cartData = JSON.parse(window.localStorage.getItem('cart') as any)
    this.cartTotal = this.cartData.total
    this.spinnerType ='ball-clip-rotate-pulse';
    this.length = this.cartData?.data?.length

  }

  openDialogPayment() {
    if (this.first_name.toString().length == 0 || this.last_name.toString().length == 0 || this.email.toString().length == 0 || this.addres.toString().length == 0 || this.city.toString().length == 0 || this.country.toString().length == 0 || this.phone.toString().length == 0) {
      let str=""
      let type=""
      if(this.lan=='en')
      {
        str="One of details is empty"
        type="ERROR"
      }
      else{
        str="אחד מהנתונים ריק"
        type="שגיאה"
      }
      this.toast.error(  str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });

    } else {
      const dialogRef: MatDialogRef<PaymentStepComponent> = this.matDialog.open(PaymentStepComponent, {
        panelClass: 'my-custom-dialog-class'
      });
      const a = document.getElementById('checkout')
      if (a) {
        a.style.filter = 'blur(5px)'
      }

      // after dialog closed
      dialogRef.afterClosed().subscribe(result => {
        if (result === false) {
          if (a) {
            a.style.filter = 'none'
          }
        }
      });
    }
  }
  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(2);
    });
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
    let cart =  JSON.parse(localStorage.getItem('cart') as any)
    if(cart)
    {
     this.length = cart?.data?.length


    }
  }
}
