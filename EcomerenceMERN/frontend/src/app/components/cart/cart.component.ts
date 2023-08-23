import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: any;
  cartTotal :any;
  subTotal:any;
  dir:any;
  constructor( public translate:TranslateService, public cartService:CartService) {

    translate.addLangs(['en', 'he']);

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
  ngDoCheck(){
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    if(this.dir=="rtl"){
      this.switchLang('he')
    }
    else{
      this.switchLang('en')
    }
    this.cartData =[]
    this.cartTotal=0;
    let cart =  JSON.parse(localStorage.getItem('cart') as any)
    this.cartData  =cart?cart:[]
    this.cartTotal = cart?.total
  }
  ngOnInit():void{
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    //assign the values from localstorage
    this.cartData =[]
    this.cartTotal=0;
    let cart =  JSON.parse(localStorage.getItem('cart') as any)
    this.cartData = cart? cart:[]
    this.cartTotal = cart?.total
  }
  ChangeQuantity(index:number, increase:boolean)
  {
    this.cartService.UpdateCartItems(index,increase)
  }
}
