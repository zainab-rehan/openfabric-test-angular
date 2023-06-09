import { Component,OnInit,OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";

import { Product } from '../product.model';
import { ProductsService } from "../products.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector:'app-product-list',
  templateUrl:'./product-list.component.html',
  styleUrls:['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy{

  totalProducts = 0;
  prodPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  productList : Product[] = [];
  isloading = false;
  userIsAuthenticated = false;
  private authListnerSubs : Subscription;
  private productsSub: Subscription;
  constructor(public productsService : ProductsService, private authService:AuthService){}

  ngOnInit(){
    this.isloading = true;
    this.productsService.getProducts(this.prodPerPage,this.currentPage);
    this.productsSub = this.productsService
      .getProductUpdateListner()
      .subscribe((productData:{products:Product[], productCount:number}) =>{
        this.isloading = false;
        this.productList = productData.products;
        this.totalProducts = productData.productCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>
      {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onChangePage(pageData : PageEvent){
    this.isloading = true;
    this.currentPage = pageData.pageIndex +1;
    this.prodPerPage = pageData.pageSize;
    this.productsService.getProducts(this.prodPerPage,this.currentPage);
  }

  onDeleteClick(productId : string){
    this.isloading = true;
    this.productsService.deleteProduct(productId).subscribe(() =>{
      this.productsService.getProducts(this.prodPerPage, this.currentPage);
    });
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
    this.authListnerSubs.unsubscribe();
  }
}
