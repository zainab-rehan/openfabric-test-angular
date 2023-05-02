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
  private productsUpdated = new Subject<{products:Product[], productCount:number}>();

  constructor(private http : HttpClient, private router : Router){}

  getProducts(prodPerPage : number , currentPage : number){

    const queryParams = `?pagesize=${prodPerPage}&page=${currentPage}`;
    this.http
    .get<{message : string , products : any, maxProducts : number}>('http://localhost:3000/products'+ queryParams)
    .pipe(map((productData)=>{
      return {products : productData. products.map(product =>{
        return {
          name : product.name,
          owner : product.owner,
          cost : product.cost,
          desc : product.desc,
          id : product._id,
          imagePath : product.imagePath
        }
      }),
      maxProducts : productData.maxProducts
      };
    }))
    .subscribe((transformedData)=>{
      this.productList = transformedData.products;
      this.productsUpdated.next({products: [...this.productList], productCount:transformedData.maxProducts});
    })
  }

  getProductUpdateListner(){
    return this.productsUpdated.asObservable();
  }

  getProduct(id : string){
    return this.http.get<{_id: string; name: string; owner:string; cost: string; desc:string, imagePath:string }>('http://localhost:3000/products/' + id);
  }

  addProduct(name : string, owner : string, cost : string, desc : string, image : File){
    const productInfo = new FormData();
    productInfo.append("name",name);
    productInfo.append("owner",owner);
    productInfo.append("cost",cost);
    productInfo.append("desc",desc);
    productInfo.append("image",image, name);

    this.http.post<{message : string, product : Product}>('http://localhost:3000/products',productInfo)
    .subscribe((responseData)=>{
      this.router.navigate(["/"]);
    });
  }

  updateProduct( productId : string, name : string, owner : string, cost : string, desc : string, image : File | string){
    let productData : Product| FormData;
    if(typeof(image) === 'object'){
      productData = new FormData();
      productData.append("id",productId),
      productData.append("name",name);
      productData.append("owner",owner);
      productData.append("cost",cost);
      productData.append("desc",desc);
      productData.append("image",image, name);

    }else if(typeof(image) === 'string') {
      productData= {
        id:productId,
        name:name,
        owner:owner,
        cost:cost,
        desc:desc,
        imagePath :image
      };
    }

    this.http.put('http://localhost:3000/products/' + productId,productData)
    .subscribe( response => {
      this.router.navigate(["/"]);
    });
  }

  deleteProduct(productId : string){
    return this.http.delete('http://localhost:3000/products/' + productId );
  }

}
