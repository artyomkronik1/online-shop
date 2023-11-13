import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {FacebookLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  private serverURL = "http://localhost:3000/api";
  password:String="";
  email:String="";
  user:any;
  dir:any;
  loggedIn:any;
  lan:any = JSON.parse(localStorage.getItem('lan') as any);
  constructor(private authService:SocialAuthService, private http: HttpClient,private toast: ToastrService,private router:Router,) {
  }
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  loginWithFB(){


    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }
register(){
 // location.reload()
  window.localStorage.setItem('loading', JSON.stringify(true))
  //localStorage.setItem('signedup', JSON.stringify(false))
  this.router.navigate(['/singup'])
}
  ngDoCheck() {
    this.dir = JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    this.lan = JSON.parse(localStorage.getItem('lan') as any);
  }
ngOnInit(){
    this.authService.authState.subscribe((user)=>{
      this.user = user;
      this.loggedIn =(user!=null)
    })
}
  login(){
    let str=""
    let type=""
    if(this.lan=='en')
    {
      str="One or more fields are empty"
      type="ERROR"
    }
    else{
      str="שדה אחד או יותר ריקים, אנא מלא את כל הפרטים "
      type="שגיאה"
    }
    // check if data is no empty
    if( this.password.length==0 || this.email.length==0 ){
      this.toast.error(str, type, {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    else {
      this.http.post(`${this.serverURL}/login`, {email: this.email, password: this.password}).subscribe((res: any) => {
        if (res.success === true) {
          //   document.location.reload()
          localStorage.setItem('logged', JSON.stringify(true))
          localStorage.setItem('signedup', JSON.stringify(true))
          let user:any={
            name:res.user.name,
            happyday:res.user?.happyday,
            birthday:res.user.birthday

          }
          localStorage.setItem('user', JSON.stringify(user))
          window.localStorage.setItem('loading', JSON.stringify(true))
          this.sleep(500).then(() => {
            this.router.navigate(['/']).then(() => {
              document.location.reload()
              window.localStorage.setItem('loading', JSON.stringify(false))
            })
          })

          let str=""
          let type=""
          if(this.lan=='en')
          {
            str="logged in successfuly"
            type="SUCCESS"
          }
          else{
            str="כניסה בוצעה בהצלחה "
            type="הצלחה"
          }
          this.toast.success( str, type, {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

        } else {
          let str=""
          let type=""
          if(this.lan=='en')
          {
            str="user does not exist"
            type="ERROR"
          }
          else{
            str="משתמש אינו קיים "
            type="שגיאה"
          }
          this.toast.error(str, type, {
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
