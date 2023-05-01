import { Component, OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Product } from '../product.model';
import { ProductsService } from "../products.service";


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls:['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit{

  inputName='';
  inputOwner='';
  inputCost='';
  inputDesc='';

  product : Product;
  isloading = false;

  private mode = 'create';
  private productId : string;


  constructor(public productsService: ProductsService,public route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
      if(paramMap.has('productId')){
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isloading = true;
        this.productsService.getProduct(this.productId).subscribe(productData =>{
          this.isloading = false;
          this.product = {id : productData._id,
            name : productData.name,
            owner : productData.owner,
            cost : productData.cost,
            desc : productData.desc}
        });
      } else{
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onSaveProduct(form:NgForm){

    if(form.invalid){
      return;
    }
    this.isloading = true;
    if( this.mode === 'create'){
      this.productsService.addProduct(form.value.name,
        form.value.owner,
        form.value.cost,
        form.value.desc);
    }else {
      this.productsService.updateProduct(this.productId,
        form.value.name,
        form.value.owner,
        form.value.cost,
        form.value.desc);
    }

    form.resetForm();

  }

  //validation and error messages
  title = new FormControl('', [Validators.required]);
  owner = new FormControl('', [Validators.required]);
  cost = new FormControl('', [Validators.required]);
  desc = new FormControl('', [Validators.required]);

  getErrorMessage(){
    if (this.title.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.owner.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.cost.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.desc.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
