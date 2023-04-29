import { Injectable } from "@angular/core";
import { Subject } from 'rxjs'
import { HttpClient } from "@angular/common/http";
import { Product } from "./product.model";
import { response } from "express";

@Injectable({providedIn:'root'})
export class ProductsService{
  private productList: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http : HttpClient){}

  getProducts(){
    this.http.get<{message : String , products : Product[]}>('http://localhost:3000/products')
    .subscribe((productData)=>{
      this.productList = productData.products;
      this.productsUpdated.next([...this.productList]);
    })
  }

  getProductUpdateListner(){
    return this.productsUpdated.asObservable();
  }

  addProduct(name:String, owner:String, cost:String, desc:String){
    const product: Product= {id:null, name:name, owner:owner, cost:cost, desc:desc};

    this.http.post<{message : String}>('http://localhost:3000/products',product)
    .subscribe((responseData)=>{
      console.log(responseData);
      this.productList.push(product);
      //sending a copy of the updated list
      this.productsUpdated.next([...this.productList]);
    });
  }

}
