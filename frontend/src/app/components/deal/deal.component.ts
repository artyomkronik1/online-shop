import { Component } from '@angular/core';
import {ProductModelServer} from "../../models/product.model";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent {
  hide: boolean = false;
  logged: any;
  signdup: any;
  user: any = null;
  select_product: boolean = false;
  products: ProductModelServer[] = [];
  allProducts: [] = []
  //categories
  allCategories: any[] = []
  category: any = null;
  loading: boolean = false;

  changed: boolean = false

  //products by category

  constructor(private cartService: CartService, private productService: ProductService, private router: Router, private spinner: NgxSpinnerService) {
  }

  selectProduct(id: number) {
    window.localStorage.setItem('dealId', JSON.stringify(id))
    this.router.navigate(['/deals', id]).then().catch((err) => {
      console.log(err)
    });
    this.select_product = true;
  }

//AddToWishList
  AddToWishList(product: any) {
    this.cartService.AddToWishList(product);
  }

//  Add to cart
  AddToCart(id: number, quantity: number) {
    this.cartService.AddDealToCart(id, quantity);
  }

  ngOnInit(): void {

    this.loading = JSON.parse(window.localStorage.getItem('loading') as any);
    this.signdup = JSON.parse(window.localStorage.getItem('signedup') as any);
    this.logged = JSON.parse(window.localStorage.getItem('logged') as any);
    this.user = JSON.parse(window.localStorage.getItem('user') as any);
    if (this.signdup === true && this.logged === true) {
      this.productService.getAllDeals().subscribe((prods: any) => {
        this.products = prods.deals;


      })
    }
  }
}
