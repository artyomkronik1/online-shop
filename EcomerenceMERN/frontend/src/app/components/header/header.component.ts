import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {CartModelServer} from "../../models/cart-model";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {DialogBodyComponent} from "../dialog-body/dialog-body.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {PaymentStepComponent} from "../payment-step/payment-step.component";
import {HomeComponent} from "../home/home.component";
import {mobile} from "../../app.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  logged:any;
  hide:boolean=false;
  signdup:any;
  lan:any="";
  user:any=null;
  username:String='';
  allProducts:[]=[]
  dir:any='en';
cartData:any= {
  total:0,
  data:[],
  wishList:[],
}
openPopup:boolean=false;
  category:any =null;
 cartTotal:number = 0;

 constructor(private renderer: Renderer2, public cartService:CartService, private elementRef: ElementRef, private productService:ProductService, private matDialog:MatDialog, private router:Router,) {
 }
  ngDoCheck(){
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    let cart =  JSON.parse(localStorage.getItem('cart') as any)
    if(cart)
    {
      this.cartData.wishList = cart?.wishList ?  cart?.wishList:[]
    }

  }
  openDialog(){
    const dialogRef: MatDialogRef<DialogBodyComponent> = this.matDialog.open(DialogBodyComponent, {
      panelClass: 'my-custom-dialog-class'

    });
    const homeComponent = this.elementRef.nativeElement.querySelector("app-home");
    const a = document.getElementById('home')
    if(homeComponent)
    {
      this.renderer.setStyle(homeComponent, 'filter', 'blur(5px)');
    }
    this.openPopup = true;
    // after dialog closed
    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        if (homeComponent) {
          this.renderer.setStyle(homeComponent, 'filter', 'none');
        }
      }
    });

  }
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  goHomePage(){
    this.category = 'All products'
    window.localStorage.setItem('loading', JSON.stringify(true))
    this.sleep(1000).then(()=>{
      this.router.navigate(['/']).then(()=> {
        window.localStorage.setItem('category', JSON.stringify('All products'))
        //document.location.reload()
        window.localStorage.setItem('loading', JSON.stringify(false))
      })
    })
  }
  changeLanguage(lan:any)
  {
    localStorage.setItem('lan', JSON.stringify(lan))
    document.location.reload()
  }
goLogout(){
  let cartDataClient = {total: 0, prodData: [], wishList:[]};
  localStorage.setItem('cart', JSON.stringify(cartDataClient));
  localStorage.setItem('user', JSON.stringify(null))
  localStorage.setItem('logged', JSON.stringify(false))
  this.logged = false
  window.localStorage.setItem('loading', JSON.stringify(true))
 // document.location.reload()
  this.sleep(500).then(()=>{
    this.router.navigate(['/login']).then(()=> {
      window.localStorage.setItem('loading', JSON.stringify(false))
    })
  })
}
  goToCheckout(){
    window.localStorage.setItem('loading', JSON.stringify(true))
    this.sleep(1000).then(()=>{
      this.router.navigate(['/checkout']).then(()=> {
        document.location.reload()
        window.localStorage.setItem('loading', JSON.stringify(false))
      })
    })
  }
goToWishListPage()
{
    //document.location.reload()
    window.localStorage.setItem('loading', JSON.stringify(true))
    this.sleep(1000).then(()=>{
      this.router.navigate(['/wishList']).then(()=> {
        window.localStorage.setItem('loading', JSON.stringify(false))
      })
    })
  }
  // openCloseSideBar(){
  //   const sideBAR:any = document.getElementById("product-properties")  as HTMLInputElement | null;
  //
  //   const right:any = document.getElementById("right")  as HTMLInputElement | null;
  //   const categories:any=document.getElementById("categories-title") as HTMLInputElement | null;
  //   if(this.hide===true) {
  //     sideBAR.style.width = "0%";
  //     sideBAR.style.opacity = "0";
  //     right.style.width ="100%"
  //
  //
  //     // categories.style.fontSize="18px"
  //     // categories.style.marginTop="5px"
  //     // categories.style.marginRight="25px"
  //     this.hide = false;
  //   }
  //   else if(this.hide===false) {
  //     console.log(2, sideBAR)
  //     sideBAR.style.width = "30%";
  //     sideBAR.style.opacity = "1";
  //     right.style.width ="70%"
  //     // categories.style.fontSize="24px"
  //     // categories.style.marginTop="0px"
  //     // categories.style.marginRight="0px"
  //     this.hide = true;
  //   }
  // }
  ngOnInit():void {
    if(JSON.parse(localStorage.getItem('lan') as any) === null) {
      localStorage.setItem('lan', JSON.stringify('en'))
    }
    this.category = JSON.parse(localStorage.getItem('category') as any)
    this.lan = JSON.parse(window.localStorage.getItem('lan') as any);
    this.signdup = JSON.parse(window.localStorage.getItem('signedup') as any);
    this.logged = JSON.parse(window.localStorage.getItem('logged') as any);
    this.user = JSON.parse(window.localStorage.getItem('user') as any);
    if(this.user) {
      const spaceIndex = this.user.name.indexOf(" "); // Find the index of the space

      if(spaceIndex!=-1) {
        const first_name = this.user.name.substring(0, spaceIndex);
        const last_name = this.user.name.substring(spaceIndex + 1);
        this.username = first_name[0] + last_name[0]
      }
      else{
        this.username = this.user.name;
      }
      this.openPopup = false;
      this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
      this.cartService.cartData$.subscribe(cartData => this.cartData = cartData);
      //deleting id:null element from wishList
      let wishes: any[] = []
      this.cartData.wishList.forEach((wish: any) => {
        if (wish.id !== null) {
          wishes.push(wish)
        }
      })
      this.cartData.wishList = wishes

      this.productService.getAllProducts().subscribe((prods: any) => {
        if (prods && prods.products) {
          this.allProducts = prods.products

          if(this.cartData.data[0] && this.cartData.data[0].product && this.cartData.data[0].product.products) {
            this.cartData.data[0].product.products = prods.products;
          }
          let cart = JSON.parse(localStorage.getItem('cart') as any);
          let prodcutsData = cart.prodData
          //reset all products in our cartData
          // if(prodcutsData.length===0) {
          //   this.cartData.data.forEach((data: any) => {
          //     data.product = null;
          //   })
          // }
          // else{
          //   this.cartData.data = prodcutsData
          // }
          let finalprocut = null;
          this.cartData.data.forEach((cardata: any) => {
            this.allProducts.forEach((product: any) => {
              prodcutsData.forEach((prop: any) => {
                if (prop.id === product.id && prop.incart == cardata.numInCart) {
                  finalprocut = product;

                  cardata.product = finalprocut
                }
              })

            })
          })
        }
      });
    }

  }

  protected readonly mobile = mobile;
}
