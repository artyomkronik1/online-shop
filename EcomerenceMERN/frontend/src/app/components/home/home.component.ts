import {Component, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {ProductModelServer, ServerResponse} from "../../models/product.model";
import {CartService} from "../../services/cart.service";
import {NgxSpinnerService} from "ngx-spinner";
import Swiper from "swiper";
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PaymentStepComponent} from "../payment-step/payment-step.component";
import {ProductComponent} from "../product/product.component";
import {mobile} from "../../app.component";
// register Swiper custom elements
register();


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {
  hide:boolean=false;
  sex:any;
  size:any;
  length:any;
  material:any;
  logged:any;
  search:String="";
  signdup:any;
  user:any=null;
  select_product:boolean=false;
  products:ProductModelServer[] = [];
  allProducts:[]=[]
  //categories
  allCategories:any[]=[]
  category:any ='All Products';
  loading:boolean=false;
  dir:any="ltr";
  changed:boolean=false
  //products by category

  constructor(public translate:TranslateService, private matDialog:MatDialog, private cartService:CartService, private productService:ProductService, private router:Router,              private spinner: NgxSpinnerService) {
    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
  }
  openProductPopup(id:any){

    window.localStorage.setItem('product_id', JSON.stringify(id));
    const dialogRef: MatDialogRef<ProductComponent> = this.matDialog.open(ProductComponent, {
      panelClass: 'my-custom-dialog-class',
      disableClose:false

    });
    const a = document.getElementById('section')
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
  switchLang(lang:string)
  {
    this.translate.use(lang)
  }
  filterProduct(propery:any, propertyName:any){
 let req={}
  if(propertyName=='sex') {
     req = {
       "cat_id":this.allCategories.indexOf(this.category)+1,
      "sex": propery,
    }
  }
    if(propertyName=='color') {
      req = {
        "cat_id":this.allCategories.indexOf(this.category)+1,
        color: propery,
      }
    }
    if(propertyName=='length') {
      req = {
        "cat_id":this.allCategories.indexOf(this.category)+1,
        length: propery,
      }
    }
    if(propertyName=='material') {
      req = {
        "cat_id":this.allCategories.indexOf(this.category)+1,
        material: propery,
      }
    }
    window.localStorage.setItem('loading', JSON.stringify(true))
    this.sleep(500).then(()=>{
      this.router.navigate(['/']).then(()=> {
        window.localStorage.setItem('loading', JSON.stringify(false))
    this.productService.getAllProductsByProperties(req).subscribe((prods: any) => {
      this.products = prods.products
    })
      })
    })

  }
  checkCategory(cat:any){
    console.log(document.getElementById('category-h'))
  }
  ngDoCheck(){
    // cat
   let cat :string = JSON.parse(localStorage.getItem('category') as string)
    if( this.category !=cat) {
      this.productsByCategory(cat)
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

    ngOnInit():void{
      this.category = JSON.parse(localStorage.getItem('category') as any)
      const stickyElement = document.querySelector('.product-properties') as any;
      if(stickyElement){stickyElement.style.position = 'sticky';}
    // slider
      var swiper = new Swiper('.slide-content', {
        slidesPerView: 3,
        spaceBetween: 30,
        grid: {
          rows: 3,
        },
        mousewheel: {
          forceToAxis: true,
        },
      });



    // time for promotions
    var countDownDate = new Date("Oct 16, 2024 00:00:00").getTime()
      var x = setInterval(function (){
        // @ts-ignore
        var now = new Date().getTime();
        var distance = countDownDate -now;


        var days = Math.floor(distance/ (1000*60*60*24))
        var hours = Math.floor((distance%(1000*60*60*24))/ (1000*60*60))
        var minutes = Math.floor((distance%(1000*60*60*24))/ (1000*60))
       var seconds  = Math.floor((distance%(1000*60))/ 1000)


        const a = document.getElementById("days")
        if(a) {
          a.innerHTML = String(days)
        }
        const b = document.getElementById("hours")
        if(b) {
          b.innerHTML = String(hours)
        }

        const c = document.getElementById("min")
        if(c) {
          c.innerHTML = String(minutes)
        }

        const d = document.getElementById("sec")
        if(d) {
          d.innerHTML = String(seconds)
        }


      }, 1000)

    //   get all categories
      // get all categories
      this.productService.getallCategories().subscribe((categories: any) => {

        if(categories.success)
        {
          categories.categories.forEach((cat:any)=>{
            this.allCategories.push(cat.title)
          })
        }
      })
    this.loading = JSON.parse(window.localStorage.getItem('loading') as any);
      this.signdup = JSON.parse(window.localStorage.getItem('signedup') as any);
      this.logged = JSON.parse(window.localStorage.getItem('logged') as any);
      this.user = JSON.parse(window.localStorage.getItem('user') as any);
     if(this.signdup===true && this.logged===true) {
       this.productService.getAllProducts().subscribe((prods: any) => {
         //store all products
         this.allProducts = prods.products;
         this.products = this.allProducts;

         })




    }
    }
  sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  goToDealsPage(){
    this.category = 'Hot Deals'

    //document.location.reload()
    window.localStorage.setItem('loading', JSON.stringify(true))
    this.sleep(1000).then(()=>{
      this.router.navigate(['/deals']).then(()=> {
        window.localStorage.setItem('loading', JSON.stringify(false))
      })
    })
  }

  goToHomePage(){
    this.category = 'All products'
    //document.location.reload()
    window.localStorage.setItem('loading', JSON.stringify(true))
    window.localStorage.setItem('category', JSON.stringify('All products'))
    this.sleep(800).then(()=>{
      this.router.navigate(['/']).then(()=> {
        window.localStorage.setItem('loading', JSON.stringify(false))
        this.productService.getAllProducts().subscribe((prods: any) => {
          if (prods && prods.products) {
            this.products = prods.products
          }
        });
      })
    })
  }
  productsByCategory(category:any)
  {
    this.category = category
    window.localStorage.setItem('loading', JSON.stringify(true))
    window.localStorage.setItem('category', JSON.stringify(category))
    if(category==='All categories') {
      this.productService.getAllProducts(category).subscribe((prods: any) => {
        this.products = prods.products
      })
    }
    else {
      this.productService.getProductsByCategory(category).subscribe((prods: any) => {
        this.products = prods.products
      })
    }

    if(document.getElementById('inlineRadio1')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio1').checked = false
    }
      if(document.getElementById('inlineRadio2')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio2').checked = false
      }
      if(document.getElementById('inlineRadio3')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio3').checked = false
      }
      if(document.getElementById('inlineRadio4')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio4').checked = false
      }
      if(document.getElementById('inlineRadio5')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio5').checked = false
      }
      if(document.getElementById('inlineRadio6')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio6').checked = false
      }    if(document.getElementById('inlineRadio7')!==null) {
        // @ts-ignore
        document.getElementById('inlineRadio7').checked = false
      }
    if(document.getElementById('inlineRadio9')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio9').checked = false
    }
    if(document.getElementById('inlineRadio10')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio10').checked = false
    }
    if(document.getElementById('inlineRadio11')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio11').checked = false
    }
    if(document.getElementById('inlineRadio12')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio12').checked = false
    }
    if(document.getElementById('inlineRadio13')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio13').checked = false
    }
    if(document.getElementById('inlineRadio14')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio14').checked = false
    }
    if(document.getElementById('inlineRadio15')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio15').checked = false
    }
    if(document.getElementById('inlineRadio55')!==null) {
      // @ts-ignore
      document.getElementById('inlineRadio55').checked = false
    }


  }
  productsByName(productName:any)
  {

    // toggleLoading
    // window.localStorage.setItem('loading', JSON.stringify(true))
    // this.sleep(500).then(()=>{
    //   window.localStorage.setItem('loading', JSON.stringify(false))
    // })

    let prodName:string=productName.target.value.toString()
    if(prodName.length) {
      this.productService.getProductsByName(prodName as any, this.allCategories.indexOf(this.category) + 1).subscribe((prods: any) => {
        if (prods && prods.products) {
          this.products = prods.products
        }
      })
    }
    else{
     this.productsByCategory(this.category)
    }

  }
  openCloseSideBar(){
    const sideBAR:any = document.getElementById("product-properties")  as HTMLInputElement | null;

    const right:any = document.getElementById("right")  as HTMLInputElement | null;
    const categories:any=document.getElementById("categories-title") as HTMLInputElement | null;
    if(this.hide===true) {
      sideBAR.style.width = "0%";
      sideBAR.style.opacity = "0";
      right.style.width ="100%"


      // categories.style.fontSize="18px"
      // categories.style.marginTop="5px"
      // categories.style.marginRight="25px"
      this.hide = false;
    }
    else if(this.hide===false) {
      console.log(2, sideBAR)
      sideBAR.style.width = "30%";
      sideBAR.style.opacity = "1";
      right.style.width ="70%"
      // categories.style.fontSize="24px"
      // categories.style.marginTop="0px"
      // categories.style.marginRight="0px"
      this.hide = true;
    }
  }
  selectProduct(id:number)
  {

    this.router.navigate(['/product', id]).then().catch((err)=>{console.log(err)});
    this.select_product=true;
  }
//AddToWishList
  AddToWishList(product:any){
    this.cartService.AddToWishList(product);
  }
//  Add to cart
  AddToCart(id:number, quantity:number)
  {
    this.cartService.AddProductToCart(id,quantity);
  }
  protected readonly mobile = mobile;
}
