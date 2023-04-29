import { Injectable } from "@angular/core";
import { Subject } from 'rxjs'

import { Product } from "./product.model";

@Injectable({providedIn:'root'})
export class ProductsService{
  private productList: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  getProducts(){
    return [...this.productList];
  }

  getProductUpdateListner(){
    return this.productsUpdated.asObservable();
  }

  addProduct(name:String, owner:String, cost:String, desc:String){
    const product: Product= {name:name, owner:owner, cost:cost, desc:desc};
    this.productList.push(product);
    //sending a copy of the updated list
    this.productsUpdated.next([...this.productList]);
  }

}
