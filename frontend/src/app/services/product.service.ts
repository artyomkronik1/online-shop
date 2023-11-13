import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ProductModelServer, ServerResponse} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = "http://localhost:3000/api";

  constructor(private http:HttpClient) {}

  //fetch all products from backend
  getAllProducts(numberOfResults:number=10){
  return this.http.get(this.SERVER_URL + '/products');
  }
  getAllProductsByProperties(req:any){
    return this.http.get(this.SERVER_URL + '/productsByProperties', {params:req});
  }
  // get all categories
  getallCategories(numberOfResults:number=10){
    return this.http.get(this.SERVER_URL + '/categories');
  }
//getAllDeals

  getAllDeals(numberOfResults:number=10){
    return this.http.get(this.SERVER_URL + '/deals');
  }

  getSingleDeal(id:number)
  {
    return this.http.get(this.SERVER_URL + '/deals/'  +id)

  }
  //getSinnglepProductFromTheServer
  getSingleProduct(id:number):Observable<ProductModelServer>
  {
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/'  +id)
  }

  //get product from specific category
  getProductsByCategory(catName:string):Observable<ProductModelServer[]>
  {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/'  +catName)
  }
  // get products by name
  getProductsByName(prodName:any, cat_id:any)
  {
    let req:any={
      cat_id:cat_id
    }
    return this.http.get(this.SERVER_URL + '/products/product/'  +prodName, {params:req})
  }

  showMessage(){
    console.log("called")
  }
}
