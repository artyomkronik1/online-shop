import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  products:ProductResponseModel[] = [];
  private  Server_url = "http://localhost:3000/api";
  constructor(private http:HttpClient) { }


//  getSingleOrder
  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel[]>(this.Server_url + '/orders' + orderId).toPromise();
  }

}

interface ProductResponseModel{
  id:number;
  title:string;
  description:string;
  price:number;
  quantity:number;
  image:string;
}
