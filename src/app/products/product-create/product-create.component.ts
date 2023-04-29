import { Component} from "@angular/core";
import { NgForm } from "@angular/forms";
import {FormControl, Validators} from '@angular/forms';
import { ProductsService } from "../products.service";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls:['./product-create.component.css']
})
export class ProductCreateComponent{
  inputName='';
  inputOwner='';
  inputCost='';
  inputDesc='';

  constructor(public productsService: ProductsService){}

  onAddProduct(form:NgForm){

    if(form.invalid){
      return;
    }

    this.productsService.addProduct(form.value.name,
      form.value.owner,
      form.value.cost,
      form.value.desc);

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
