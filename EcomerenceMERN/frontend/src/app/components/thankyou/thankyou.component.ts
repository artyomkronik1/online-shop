import { Component, OnInit } from '@angular/core';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent  {
  message: any;
  orderId: any;
  products: any[] = [];
  cartTotal: any;
  dir:any="";
  constructor(private router: Router, public translate:TranslateService,
              private orderService: OrderService) {
    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
    const navigation = this.router.getCurrentNavigation();
    if(navigation) {
      const state = navigation.extras.state as {
        message: string,
        products: any[],
        orderId: number,
        total: number
      };

      if(state) {
        this.message = state.message;
        this.products = state.products;
        this.orderId = state.orderId;
        //reset total to zero
        this.cartTotal = 0;
        //quantity of every prodcut * its price
        this.products.forEach((product: any) => {
          this.cartTotal += product.price * product.quantity
        })
      }
      //this.cartTotal = state.total;

    }

  }
  switchLang(lang:string)
  {
    this.translate.use(lang)
  }
  ngDoCheck(){
    // lagm
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    if(this.dir=="rtl"){
      this.switchLang('he')
    }
    else{
      this.switchLang('en')
    }
  }

}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityOrdered: number;
}
