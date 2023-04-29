import { Component,Input } from "@angular/core";

@Component({
  selector:'app-product-list',
  templateUrl:'./product-list.component.html',
  styleUrls:['./product-list.component.css']
})
export class ProductListComponent{
  /* productList=[
   {name:"First Product",owner:"Owner 1", cost:"20$",desc:"First Product Content"},
   {name:"Second Product",owner:"Owner 2", cost:"20$",desc:"Second Product Content"},
   {name:"Third Product",owner:"Owner 3", cost:"20$",desc:"Third Product Content"}
  ] */

  @Input() productList=[];
}
