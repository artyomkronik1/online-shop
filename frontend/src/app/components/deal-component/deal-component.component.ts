import {Component, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {CartService} from "../../services/cart.service";
import {ActivatedRoute} from "@angular/router";

import {map} from 'rxjs/operators';

declare let $: any;
@Component({
  selector: 'app-deal-component',
  templateUrl: './deal-component.component.html',
  styleUrls: ['./deal-component.component.scss']
})
export class DealComponentComponent  {
  @ViewChild('quantity',{static:true}) quantityInput:any;

  products:any[]=[];
  product_id:any=window.localStorage.getItem('dealId')
  product:any;
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.productService.getSingleDeal(this.product_id).subscribe((prod:any) => {
      this.product = prod.products[0]

    })

  }


  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    value++;


    this.product.quantity = value
    this.quantityInput.nativeElement.value = value.toString();

  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity > 0) {
      value--;

      if (value <= 1) {
        value = 1;
      }
    } else {
      return;
    }
    this.product.quantity = value
    this.quantityInput.nativeElement.value = value.toString();
  }

  ngAfterViewInit(): void {

// Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(id: number) {

    this.cartService.AddProductToCart(id, this.product.quantity,this.product.quantity );
  }
}
