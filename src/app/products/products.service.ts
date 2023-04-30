import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { response } from "express";
import { HttpClient } from "@angular/common/http";

import { Product } from "./product.model";


@Injectable({providedIn:'root'})
export class ProductsService{
  private productList: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http : HttpClient){}

  getProducts(){
    this.http
    .get<{message : string , products : any}>('http://localhost:3000/products')
    .pipe(map((productData)=>{
      return productData. products.map(product =>{
        return {
          name : product.name,
          owner : product.owner,
          cost : product.cost,
          desc : product.desc,
          id : product._id
        }
      })
    }))
    .subscribe((transformedData)=>{
      this.productList = transformedData;
      this.productsUpdated.next([...this.productList]);
    })
  }

  getProductUpdateListner(){
    return this.productsUpdated.asObservable();
  }

  addProduct(name:string, owner:string, cost:string, desc:string){
    const product: Product= {id:null, name:name, owner:owner, cost:cost, desc:desc};

    this.http.post<{message : string}>('http://localhost:3000/products',product)
    .subscribe((responseData)=>{
      console.log(responseData);
      this.productList.push(product);
      //sending a copy of the updated list
      this.productsUpdated.next([...this.productList]);
    });
  }

}
