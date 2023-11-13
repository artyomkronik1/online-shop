import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {WishComponent} from "./components/wish/wish.component";
import {AccountComponent} from "./components/account/account.component";
import {DealComponent} from "./components/deal/deal.component";
import {DealComponentComponent} from "./components/deal-component/deal-component.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'account', component:AccountComponent
  },
  {
    path:'product/:id', component:ProductComponent
  },
  {
    path:'deals/:id', component:DealComponentComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path:'checkout', component:CheckoutComponent
  },
  {
    path:'login', component:LoginComponent,
  },
  {
    path:'singup', component:SignupComponent,
  },
  {
    path:'thankyou', component:ThankyouComponent
  },
  {
    path:'wishList', component:WishComponent
  },
  {
    path:'deals', component:DealComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
