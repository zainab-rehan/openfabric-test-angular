import { Component,OnInit,OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';


import { Product } from '../product.model';
import { ProductsService } from "../products.service";

@Component({
  selector:'app-product-list',
  templateUrl:'./product-list.component.html',
  styleUrls:['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy{

  productList : Product[] = [];
  isloading = false;
  private productsSub: Subscription;
  constructor(public productsService : ProductsService){}

  ngOnInit(): void {
    this.isloading = true;
    this.productsService.getProducts();
    //3 parameters --- subscribe(data, error, when no more data can be added)
    this.productsSub = this.productsService.getProductUpdateListner()
      .subscribe(( productList: Product[])=>{
        this.isloading = false;
        this.productList = productList;
    });
  }
  ngOnDestroy(): void {
    //to avoid memory leak we unsubscribe
    this.productsSub.unsubscribe();
  }

  onEditClick(){

  }
  onDeleteClick(productId : string){
    this.productsService.deleteProduct(productId);
  }
}
