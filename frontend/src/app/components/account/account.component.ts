import { Component } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor(private router:Router,  ) {
  }
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  user:any = JSON.parse(window.localStorage.getItem('user') as any);
  logged:boolean = true;
  logout(){

    localStorage.setItem('user', JSON.stringify(null))
    localStorage.setItem('logged', JSON.stringify(false))
    this.logged = false
    window.localStorage.setItem('loading', JSON.stringify(true))
    document.location.reload()
    this.sleep(500).then(()=>{
      this.router.navigate(['/']).then(()=> {
        window.localStorage.setItem('loading', JSON.stringify(false))
      })
    })
    //   and then move to login page
  }
}
