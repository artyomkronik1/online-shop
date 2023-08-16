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
    prodData: [{
      incart: 0,
      id: 0
    }],
    wishList:[]
  };

  // Data variable to store cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }],
    wishList:[]
  };

  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE*/
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

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

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //  Get the information from local storage ( if any )
    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart') as any);

    //  Check if the info variable is null or has some data in it

    if (info !== null && info !== undefined && info.prodData[0] && info.prodData[0].incart !== 0) {
      //  Local Storage is not empty and has some information
      this.cartDataClient = info;

      //  Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            // CartDataServer already has some entry in it
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        });
      });

    }

  }
  AddToWishList(prod:any ){
    //if wish list is empty
    if(Number(this.cartDataServer.wishList.length)==0 )
    {
      this.cartDataServer.wishList.push({id:prod.id})
      this.cartDataClient.wishList.push({id:prod.id})

      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
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
   else if(this.cartDataServer.wishList.length>0 )
    {
      let inList:number=0
      //check if this product is already in wish list  ---> dont add --> else add
      this.cartDataServer.wishList.forEach((wish:any)=>{
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
        this.cartDataServer.wishList.push({id:prod.id})
        this.cartDataClient.wishList.push({id:prod.id})
        this.toast.success(`${prod.name} added to the wish list`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
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
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });

      } else {



        const index =  prod.id;
        let prodAlreadyExist = false;
        this.cartDataServer.data.forEach((data:any)=>{
          //check if product that we want to add is already exist
          if(data.product.id === id )
          {
            prodAlreadyExist=true;
            let flag:boolean=false;
            this.cartDataClient.prodData.forEach((prop:any)=>{

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
              this.cartDataClient.prodData.push({incart:quantity?quantity:1, id:id})
            }
            this.CalculateTotal();
            //INCREASE incart of this procut on localstorage
            this.cartDataServer.data.forEach((cardata:any)=>{
              if(cardata.product.id ===id &&!num_in_cart)
              {
                cardata.numInCart++;
              }
              if(cardata.product.id ===id &&num_in_cart)
              {
                cardata.numInCart +=num_in_cart ;
              }
            })
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataServer});
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
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
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
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
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
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
       // this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = 1;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });

      } else {



        const index =  prod.id;
        let prodAlreadyExist = false;
        this.cartDataServer.data.forEach((data:any)=>{
          //check if product that we want to add is already exist
          if(data.product && data.product.id === id )
          {
            prodAlreadyExist=true;
              let flag:boolean=false;
              this.cartDataClient.prodData.forEach((prop:any)=>{

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
                this.cartDataClient.prodData.push({incart:quantity?quantity:1, id:id})
              }
              this.CalculateTotal();
            //INCREASE incart of this procut on localstorage
            this.cartDataServer.data.forEach((cardata:any)=>{
              if(cardata.product.id ===id &&!num_in_cart)
              {
                cardata.numInCart++;
              }
              if(cardata.product.id ===id &&num_in_cart)
              {
                cardata.numInCart +=num_in_cart ;
              }
            })
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
               this.cartData$.next({...this.cartDataServer});
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
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
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
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        }  // END OF ELSE
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean) {
    const data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart +1;
      //increase the numbers in cart of this product in local storage
      this.cartDataServer.data[index].numInCart++
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}], wishList:[{ id: undefined}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}], wishList:[{ id: undefined}]};
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
      }


    } else {
      // IF THE USER CLICKS THE CANCEL BUTTON
      return;
    }
  }


  DeleteProductFromWishList(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataClient.wishList.splice(index, 1);
      this.cartDataServer.wishList = this.cartDataClient.wishList
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
         document.location.reload()
    } else {
      // IF THE USER CLICKS THE CANCEL BUTTON
      return;
    }
  }



  CheckoutFromCart(userId: number) {
    this.http.post(`${this.serverURL}/orders/payment`, null).subscribe((res:any) => {
      if (res.success) {
        let data = this.cartDataServer.data
        let products:any=[];

        data.forEach((p:any)=>{
          p.product.quantityOrdered = p.numInCart
          products.push(p.product)
        })
        this.resetServerData();
        // this.http.post(`${this.serverURL}/orders/new`, {
        //   userId,
        //   products: this.cartDataClient.prodData
        // }).subscribe((data: any) => {
        // //  console.log('data', data)
        //   this.orderService.getSingleOrder().then(prods => {
            // if (data.success) {

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
                this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}], wishList:[{id:null}]};
                this.cartDataServer = {  total: 0, data: [{numInCart: 0, product: undefined}], wishList:[{id:null}]}
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartData$.next(this.cartDataServer);
              });
          //  }
          // });
        // });
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
    let cart = JSON.parse(window.localStorage.getItem('cart')as any);
    //check if we have any products in cart
    if( this.cartDataServer.data.length>0) {
      this.productService.getAllProducts().subscribe((prods: any) => {
        allProducts = prods.products
        allProducts.forEach((product: any) => {
          this.cartDataServer.data.forEach((p: any) => {
            //every product price * its quantity
            if (p.product.id == product.id) {
              Total += p.numInCart * product.price
            }

          })
        })

        this.cartDataServer.total = Total;
        this.cartTotal$.next(this.cartDataServer.total);
      })
    }
    //if there is no products the total is 0
    else{
      this.cartDataServer.total = 0;
      this.cartTotal$.next(this.cartDataServer.total);
    }

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
        const numInCart =  this.cartDataServer.data[0].numInCart;
          const price = this.cartDataServer.data[0].product.price;
          //updated Total
          Total += numInCart * price;
          this.cartDataServer.total = Total;
          this.cartTotal$.next(this.cartDataServer.total);
  }
  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
      , wishList:[{ id: undefined}]
    };

    this.cartDataClient = {
      total: 0,
      prodData: [{
        incart: 0,
        id: 0
      }]
      , wishList:[{ id: undefined}]
    };

    this.cartData$.next({...this.cartDataServer});
  }
  CalculateSubTotal(index:any): number {
    let subTotal = 0;

    const p = this.cartDataServer.data[index];
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
