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



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})


export class CheckoutComponent implements OnInit {
  length:any;
  cartTotal: any;
  cartData: any;
  spinnerType:any;
  dir:any;
  constructor(public translate:TranslateService,private matDialog:MatDialog, private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService
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
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.spinnerType ='ball-clip-rotate-pulse';
    this.length = this.cartData?.total
  }

  openDialogPayment(){
    const dialogRef: MatDialogRef<PaymentStepComponent> = this.matDialog.open(PaymentStepComponent, {
      panelClass: 'my-custom-dialog-class'
    });
   const a = document.getElementById('checkout')
    if(a)
    {
      a.style.filter='blur(5px)'
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
  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(2);
    });
  }
  ngDoCheck(){
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
     this.length = cart?.total


    }
  }
}
