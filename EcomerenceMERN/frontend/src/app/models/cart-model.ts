import {ProductModelServer} from "./product.model";

export interface CartModelServer{
  total:number;
  data:any[];
  wishList:any[]

}
export interface CartModelPublic{
  total:number;
  data:any[];
  wishList:any[]
};
