import { Component } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {NavigationExtras, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-toggle-loading',
  templateUrl: './toggle-loading.component.html',
  styleUrls: ['./toggle-loading.component.scss']
})
export class ToggleLoadingComponent {
  spinnerType:any="";
  loading:any=null;
  dir:any;
  constructor(public translate:TranslateService, private cartService:CartService, private productService:ProductService, private router:Router,              private spinner: NgxSpinnerService) {
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
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  ngOnInit(){

    this.spinnerType ='ball-clip-rotate-pulse';
    this.loading = window.localStorage.getItem('loading')
  }
  ngDoCheck() {
      this.loading = JSON.parse(window.localStorage.getItem('loading') as any)
      if(this.loading===true){


            this.spinner.show().then(p=>{
              this.sleep(2000).then(p=>{
                this.loading = false
                window.localStorage.setItem('loading', JSON.stringify(false))
                return
          })

        })
      }

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
