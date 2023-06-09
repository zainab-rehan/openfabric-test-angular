import { Component, OnInit} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Product } from '../product.model';
import { ProductsService } from "../products.service";
import { mimeType } from "./mime-type.validator";

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
  form : FormGroup;
  imgPreview : string;

  private mode = 'create';
  private productId : string;


  constructor(public productsService: ProductsService,public route: ActivatedRoute){}

  ngOnInit(){
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators :[Validators.required]
      }),
      'owner': new FormControl(null, {
        validators :[Validators.required ]
      }),
      'cost': new FormControl(null, {
        validators :[Validators.required, Validators.pattern("^[0-9]*$")]
      }),
      'desc': new FormControl(null, {
        validators :[Validators.required ]
      }),
      'image': new FormControl(null, {
        validators :[Validators.required ],
        asyncValidators:[mimeType]
      })
    });

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
            desc : productData.desc,
            imagePath : productData.imagePath
          };
          this.form.setValue({
            name : this.product.name,
            owner : this.product.owner,
            cost : this.product.cost,
            desc : this.product.desc,
            image : this.product.imagePath
          });
        });
      } else{
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImageSelected(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = (e) =>{
      this.imgPreview = reader.result as string;
      console.log(e);
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct(){

    if(this.form.invalid){
      return;
    }
    this.isloading = true;
    if( this.mode === 'create'){
      this.productsService.addProduct(this.form.value.name,
        this.form.value.owner,
        this.form.value.cost,
        this.form.value.desc,
        this.form.value.image);
    }else {
      this.productsService.updateProduct(this.productId,
        this.form.value.name,
        this.form.value.owner,
        this.form.value.cost,
        this.form.value.desc,
        this.form.value.image
        );
    }

    this.form.reset();

  }

  //validation and error messages
  title = new FormControl('', [Validators.required]);
  owner = new FormControl('', [Validators.required]);
  cost = new FormControl('', [Validators.required]);
  desc = new FormControl('', [Validators.required]);

  getTitleError(){
    if (this.title.hasError('required')) {
      return 'You must enter a value';
    }
  }
  getOwnerError(){
    if (this.owner.hasError('required')) {
      return 'You must enter a value';
    }
  }
  getCostError(){
    if(this.cost.hasError('required')) {
      return 'You must enter a numeric value';
    }
  }
  getDescError(){
    if (this.desc.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
