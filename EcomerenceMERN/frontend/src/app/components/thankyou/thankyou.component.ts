import { Component, OnInit } from '@angular/core';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
  message: any;
  orderId: any;
  products: any[] = [];
  cartTotal: any;
  constructor(private router: Router,
              private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation) {
      const state = navigation.extras.state as {
        message: string,
        products: any[],
        orderId: number,
        total: number
      };

      if(state) {
        this.message = state.message;
        this.products = state.products;
        this.orderId = state.orderId;
        //reset total to zero
        this.cartTotal = 0;
        //quantity of every prodcut * its price
        this.products.forEach((product: any) => {
          this.cartTotal += product.price * product.quantityOrdered
        })
      }
      //this.cartTotal = state.total;

    }

  }

  ngOnInit(): void {
  }

}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityOrdered: number;
}
