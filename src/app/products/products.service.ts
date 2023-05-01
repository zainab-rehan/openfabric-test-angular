import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { response } from "express";
import { HttpClient } from "@angular/common/http";

import { Product } from "./product.model";
import { Router } from "@angular/router";


@Injectable({providedIn:'root'})
export class ProductsService{
  private productList: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http : HttpClient, private router : Router){}

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

  getProduct(id : string){
    return this.http.get<{_id: string; name: string; owner:string; cost: string; desc:string }>('http://localhost:3000/products/' + id);
  }

  addProduct(name : string, owner : string, cost : string, desc : string){
    const product: Product= {id:null, name:name, owner:owner, cost:cost, desc:desc};

    this.http.post<{message : string, productId : string}>('http://localhost:3000/products',product)
    .subscribe((responseData)=>{
      console.log(responseData);
      //changing the id from null to the one assigned by mongoose
      const id = responseData.productId;
      product.id = id;
      this.productList.push(product);
      this.productsUpdated.next([...this.productList]);
      this.router.navigate(["/"]);
    });
  }

  updateProduct( productId : string, name : string, owner : string, cost : string, desc : string){
    const product: Product= {id:productId, name:name, owner:owner, cost:cost, desc:desc};
    this.http.put('http://localhost:3000/products/' + productId,product)
    .subscribe( response => {
      console.log(response);
      const updatedProducts = [...this.productList];
      const oldProductIndex = updatedProducts.findIndex( prod => prod.id === product.id);
      updatedProducts[oldProductIndex] = product;
      this.productList = updatedProducts;
      this.productsUpdated.next([...this.productList]);
      this.router.navigate(["/"]);
    });
  }

  deleteProduct(productId : string){
    this.http.delete('http://localhost:3000/products/' + productId )
    .subscribe(()=>{
      console.log(productId);
      const updatedProducts = this.productList.filter(product => product.id != productId );
      this.productList = updatedProducts;
      this.productsUpdated.next([...this.productList]);
    })
  }

}
