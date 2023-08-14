import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";
import {mobile} from "../../app.component";

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})



export class ProductComponent  {
  @ViewChild('quantity',{static:true}) quantityInput:any;
  dir:any;
  closePopup:boolean=false;
  products:any[]=[];
  product_id:any=JSON.parse(window.localStorage.getItem('product_id') as any);
  product:any;
  constructor( private dialogRef: MatDialogRef<ProductComponent>, public translate:TranslateService, private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {

    translate.addLangs(['en', 'he']);

    if(this.dir=="rtl"){
      translate.setDefaultLang('he')
    }
    else{
      translate.setDefaultLang('en')
    }
  }
  switchLang(lang:string)
  {
    this.translate.use(lang)
  }
  outSide(){
    console.log('a')
  }
  // closeDialog(){
  //
  //
  //   this.closePopup = true;
  //   // sengind event that dialog closed
  //   this.dialogRef.close('closed');
  // }

  closeDialog() {
    this.dialogRef.close();
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
  ngOnInit(): void {
    this.dir=  JSON.parse(localStorage.getItem('lan') as any) == 'he' ? "rtl" : "ltr"
    this.productService.getSingleProduct(this.product_id).subscribe((prod:any) => {
      this.products = prod.products;
      this.products.forEach((p:any)=>{
        if(p.id===Number(this.product_id))
        {
          this.product=p
        }
      })

  })

  }
  AddToWishList(product:any){
    this.cartService.AddToWishList(product);
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

  protected readonly mobile = mobile;
}
