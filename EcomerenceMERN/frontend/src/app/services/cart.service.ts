import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {CartModelPublic, CartModelServer} from '../models/cart-model';
import {BehaviorSubject} from 'rxjs';
import {NavigationExtras, Router} from '@angular/router';
import {ProductModelServer} from '../models/product.model';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private serverURL = "http://localhost:3000/api";
  dir:any='ltr';
  // Data variable to store the cart information on the client's local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    data: [],
    wishList:[]
  };



  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE*/
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataClient);

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
  ngOnInit(){

    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
  }
  constructor(private http: HttpClient,
              public translate:TranslateService,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {
    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }

    this.cartTotal$.next(this.cartDataClient.total);
    this.cartData$.next(this.cartDataClient);

    //  Get the information from local storage ( if any )
    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart') as any);

    //  Check if the info variable is null or has some data in it

    if (info !== null && info !== undefined && info.data[0] && info.data[0].incart !== 0) {
      //  Local Storage is not empty and has some information
      this.cartDataClient = info;

      //  Loop through each entry and put it in the cartDataServer object
      // this.cartDataClient.data.forEach((p:any) => {
      //
      //     this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
      //       if (this.cartDataServer.data[0].numInCart === 0) {
      //         this.cartDataServer.data[0].numInCart = p.incart;
      //         this.cartDataServer.data[0].product = actualProductInfo;
      //         this.CalculateTotal();
      //         this.cartDataClient.total = this.cartDataServer.total;
      //         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      //       } else {
      //         // CartDataServer already has some entry in it
      //         this.cartDataServer.data.push({
      //           numInCart: p.incart,
      //           product: actualProductInfo
      //         });
      //         this.CalculateTotal();
      //         this.cartDataClient.total = this.cartDataServer.total;
      //         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      //       }
      //       this.cartData$.next({...this.cartDataServer});
      //     });
      //
      // });

    }

  }
  AddToWishList(prod:any ){
    //if wish list is empty
    if(Number(this.cartDataClient.wishList.length)==0 )
    {
      this.cartDataClient.wishList.push({id:prod.id})
      this.cartDataClient.wishList.push({id:prod.id})

      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataClient});
      let str=""
      if(this.dir=='ltr')
      {
        str="added to the wish list"
      }
      else{
        str="נוסף בהצלחה לפריטים אהובים"
      }
      this.toast.success(`${prod.name}` + str, 'Product Added', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  //  else if wisth list is not empty
   else if(this.cartDataClient.wishList.length>0 )
    {
      let inList:number=0
      //check if this product is already in wish list  ---> dont add --> else add
      this.cartDataClient.wishList.forEach((wish:any)=>{
        if(wish.id===prod.id)
        {
          inList =  1
          this.toast.info(`${prod.name} is already in wish list`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      })

      if(inList===0)
      {
        this.cartDataClient.wishList.push({id:prod.id})
        this.cartDataClient.wishList.push({id:prod.id})
        this.toast.success(`${prod.name} added to the wish list`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataClient});
      }
    }
  }
  ;
  AddDealToCart(id: number, quantity?: number ,num_in_cart?:number) {
    this.productService.getSingleDeal(id).subscribe((prod :any)=> {
      //getting the product by specific id
      prod.products.forEach((product:any)=>{
        if(product.id ===id)
        {
          prod = product;
        }
      })
      //  1. If the cart is empty
      if (this.cartDataClient.data[0].product === undefined) {
        this.cartDataClient.data[0].product = prod;
        this.cartDataClient.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataClient});
        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });

      } else {



        const index =  prod.id;
        let prodAlreadyExist = false;
        this.cartDataClient.data.forEach((data:any)=>{
          //check if product that we want to add is already exist
          if(data.product.id === id )
          {
            prodAlreadyExist=true;
            let flag:boolean=false;
            this.cartDataClient.data.forEach((prop:any)=>{

              if(prop.id===id && !num_in_cart)
              {
                prop.incart++;
                flag=true;
              }
              else if(prop.id===id && num_in_cart && num_in_cart>0)
              {
                prop.incart+=num_in_cart;
                flag=true;
              }
            })
            if(flag===false){
              this.cartDataClient.data.push({incart:quantity?quantity:1, id:id})
            }
            this.CalculateTotal();
            //INCREASE incart of this procut on localstorage
            this.cartDataClient.data.forEach((cardata:any)=>{
              if(cardata.product.id ===id &&!num_in_cart)
              {
                cardata.numInCart++;
              }
              if(cardata.product.id ===id &&num_in_cart)
              {
                cardata.numInCart +=num_in_cart ;
              }
            })
            this.cartDataClient.total = this.cartDataClient.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataClient});
            this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });

          }

        })
        // IF product is not in the cart array
        if(prodAlreadyExist===false) {
          this.cartDataClient.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.data.push({
            incart: 1,
            id: prod.id
          });

          this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataClient.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataClient});
        }  // END OF ELSE
      }
    });
  }
  AddProductToCart(id: number, quantity?: number ,num_in_cart?:number) {
    this.productService.getSingleProduct(id).subscribe((prod :any)=> {
       //getting the product by specific id
       prod.products.forEach((product:any)=>{
         if(product.id ===id)
         {
           prod = product;
         }
       })
      //  1. If the cart is empty
      if (this.cartDataClient?.data?.length===0 && this.cartDataClient?.data?.length ===0) {
        this.cartDataClient.data.push({ numInCart:1, product:prod})
        this.cartDataClient.total = prod.price
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataClient});
        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });

      } else {
        const index =  prod.id;
        let prodAlreadyExist = false;
        this.cartDataClient.data.forEach((data:any)=> {
          //check if product that we want to add is already exist
          if (data.product && data.product.id === id) {
            prodAlreadyExist = true;
            data.numInCart++;
            this.cartDataClient.total+=prod.price
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataClient});
            this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
          }

        })

        // IF product is not in the cart array
        if(prodAlreadyExist===false) {
          this.cartDataClient.data.push({
            numInCart: 1,
            product: prod
          });
          this.cartDataClient.total+=prod.price
          this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataClient});
        }  // END OF ELSE
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean) {
    const data = this.cartDataClient.data[index];
    if(data.numInCart && this.cartDataClient.data[index].numInCart) {
      if (increase) {

        data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
        this.cartDataClient.data[index].incart = data.numInCart + 1;
        //increase the numbers in cart of this product in local storage
        data.numInCart++
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataClient.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataClient});

      } else {
        data.numInCart--;

        if (data.numInCart < 1) {
          this.DeleteProductFromCart(index);
          this.cartData$.next({...this.cartDataClient});
        } else {
          this.cartData$.next({...this.cartDataClient});
          this.cartDataClient.data[index].incart = data.numInCart;
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataClient.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataClient.data.splice(index, 1);
      let total:number= 0;
      this.cartDataClient.data.forEach((p:any)=>{
        total+=p.product.price * p.numInCart
      })
      this.cartDataClient.total = total
      console.log('d',this.cartDataClient)
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {total: 0, data: [], wishList: []};
      }
      window.localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      this.cartData$.next({...this.cartDataClient});
    } else {
      // IF THE USER CLICKS THE CANCEL BUTTON
      return;
    }
  }


  DeleteProductFromWishList(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataClient.wishList.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataClient});
         document.location.reload()
    } else {
      // IF THE USER CLICKS THE CANCEL BUTTON
      return;
    }
  }



  CheckoutFromCart(userId: number) {
    this.http.post(`${this.serverURL}/orders/payment`, null).subscribe((res:any) => {
      if (res.success) {
        let data = this.cartDataClient.data
        let products:any=[];

        data.forEach((p:any)=>{
          p.product.quantity = p.numInCart
          products.push(p.product)
        })
        //this.resetServerData();
        let dataServer:CartModelServer = {
          data:[], total:0, wishList:this.cartDataClient.wishList
        }
        let dataClient:CartModelPublic = {
          data:[], total:0, wishList:this.cartDataClient.wishList
        }
        this.cartDataClient = dataServer
        window.localStorage.setItem('cart', JSON.stringify(dataClient))
              const navigationExtras: NavigationExtras = {
                state: {
                  message: 'success',
                  products: products,
                  orderId: 0,
                  total: this.cartDataClient.total
                }
              };

              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartTotal$.next(0);
                this.cartData$.next(this.cartDataClient);
              });
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }
  CalculateTotal() {
    //assign zero on the start
    let Total = 0;
    let allProducts:any=[]
    //getting total of the cart from localstorage
    //check if we have any products in cart
    if( this.cartDataClient.data.length>0) {
      this.productService.getAllProducts().subscribe((prods: any) => {
        allProducts = prods.products
        allProducts.forEach((product: any) => {
          this.cartDataClient.data.forEach((p: any) => {
            //every product price * its quantity
            if (p.product.id == product.id) {
              Total += p.numInCart * product.price
            }

          })
        })

        this.cartDataClient.total = Total;
        this.cartTotal$.next(this.cartDataClient.total);

      })
    }
    //if there is no products the total is 0
    else{
      this.cartDataClient.total = 0;
      this.cartTotal$.next(this.cartDataClient.total);
    }
    return Total;
  }
   CalculateTotal2(index:number) {
    //assign zero on the start
    let Total = 0;
    //getting total of the cart from localstorage
    let cart = JSON.parse(window.localStorage.getItem('cart')as any);
    if(cart && cart.total)
    {
      Total = cart.total
    }
        const numInCart :number =  this.cartDataClient?.data[0]?.numInCart;
          const price = this.cartDataClient.data[0].product.price;
          //updated Total
          Total += numInCart * price;
          this.cartDataClient.total = Total;
          this.cartTotal$.next(this.cartDataClient.total);
  }
  private resetServerData() {
    this.cartDataClient = {
      total: 0,
      data: []
      , wishList:[]
    };


    this.cartData$.next({...this.cartDataClient});
  }
  CalculateSubTotal(index:any): number {
    let subTotal = 0;

    const p = this.cartDataClient.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }
}


interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }];
}
