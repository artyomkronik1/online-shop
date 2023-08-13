import {ProductModelServer} from "./product.model";

export interface CartModelServer{
  total:number;
  data:[{
    product:any,
    numInCart:number,
  }];
  wishList:any[]

}
export interface CartModelPublic{
  total:number;
  prodData:[{
    id:number,
    incart:number,
  }];
  wishList:any[]
};
