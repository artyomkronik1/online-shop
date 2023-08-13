export interface ProductModelServer{
  id:number;
  name:string;
  category:string;
  description:string;
  quantity:number;
  price:number;
  image:string;
}

export interface ServerResponse{
  count:number;
  products:ProductModelServer[];
}
