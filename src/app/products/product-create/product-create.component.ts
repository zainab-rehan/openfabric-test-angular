import { Component, EventEmitter, Output } from "@angular/core";

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

  @Output() productCreated = new EventEmitter();

  onAddProduct(){
   const product = {
      name:this.inputName,
      owner:this.inputOwner,
      cost:this.inputCost,
      desc:this.inputDesc
    };

    this.productCreated.emit(product);
  }
}
