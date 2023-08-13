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
  }
  ngOnInit():void{
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    //assign the values from localstorage
    this.cartService.cartData$.subscribe((data:any)=>this.cartData = data);
    this.cartService.cartTotal$.subscribe((total:any)=>this.cartTotal = total)
  }
  ChangeQuantity(index:number, increase:boolean)
  {
    this.cartService.UpdateCartItems(index,increase)
  }
}
