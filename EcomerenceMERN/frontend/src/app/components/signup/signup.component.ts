import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private serverURL = "http://localhost:3000/api";
  username:String="";
  password:String="";
  email:String="";
  happyday:String="";
  birthday:String="";
  phone:String="";
  dir:any="";
  constructor(public translate:TranslateService, private http: HttpClient,private toast: ToastrService,private router:Router,    ) {
    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
  }
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  switchLang(lang:string)
  {
    this.translate.use(lang)
  }
  login(){

  //  location.reload()
    window.localStorage.setItem('loading', JSON.stringify(true))
   // localStorage.setItem('signedup', JSON.stringify(true))
    this.sleep(200).then(()=> {
      this.router.navigate(['/login'])
    })
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
  signUp(){
    let user:any={
      name:this.username,
      password:this.password,
      email:this.email,
      phone:this.phone,
      birthday:this.birthday,
      happyday:this.happyday,
    }
    // check if data is no empty
    if(this.username.length==0 || this.password.length==0 || this.email.length==0 || this.phone.length==0 || this.birthday.length==0 || this.happyday.length==0){
      this.toast.error('One or more fields are empty', 'ERROR', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    else {
      this.http.post(`${this.serverURL}/signup`, {
        name: this.username,
        email: this.email,
        password: this.password
      }).subscribe((res: any) => {

        if (res.success === true) {
          localStorage.setItem('signedup', JSON.stringify(true))
          localStorage.setItem('logged', JSON.stringify(true))
          localStorage.setItem('user', JSON.stringify(user))
          window.localStorage.setItem('loading', JSON.stringify(true))
          this.router.navigate(['/'])
          this.toast.success(`${this.username} signed in successfuly`, 'SUCCESS', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          document.location.reload()
          this.sleep(500).then(() => {
            this.router.navigate(['/']).then(() => {
              window.localStorage.setItem('loading', JSON.stringify(false))
            })
          })
        }
        if (res.success == false) {
          this.toast.error(`${this.username} is already exist`, 'ERROR', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      })
    }
  }
}
