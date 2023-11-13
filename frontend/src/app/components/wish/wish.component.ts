import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss']
})
export class WishComponent implements OnInit {
  cartData:any[]=[];
  allProducts:[] =[]
  ids:[]=[]
  constructor(public cartService:CartService, public productService:ProductService ) {


  }
  ngDoCheck(){
    this.cartData=[];
    let cart =  JSON.parse(localStorage.getItem('cart') as any)
    if(cart)
    {
      this.ids = cart.wishList
      this.getDATA()
    }
  }
  //get all products
  ngOnInit():void{
    let ids:any = [];
    //assign the values from localstorage
    this.cartService.cartData$.subscribe((data:any)=>this.ids = data.wishList);
    //getting all products
    this.productService.getAllProducts().subscribe((prods:any)=> {
      this.allProducts = prods.products
      this.getDATA();
    })

  }

  //get the info of products by ids from wish list
  getDATA(){
    this.allProducts.forEach((product: any) => {
      this.ids.forEach((wish:any)=>{
        if(wish.id == product.id)
        {
          this.cartData.push(product)
        }
      })
    });
  }
deleteFromWishList(i:number)
{
  //getting the updated cart
  this.cartService.DeleteProductFromWishList(i);
  let cart = localStorage.getItem('cart') as any;
  this.ids = cart.wishList
  let products:any=[]
  //getting the info from the updated products
  if(cart.wishList && cart.wishList.length>0) {
    this.allProducts.forEach((product: any) => {
      this.ids.forEach((wish: any) => {
        if (wish.id === product.id) {
          products.push(product)

        }
      })
    });
    this.cartData = products
  }
  else{
    this.cartData=[]
  }
}
  ChangeQuantity(index:number, increase:boolean)
  {
    this.cartService.UpdateCartItems(index,increase)
  }
}
