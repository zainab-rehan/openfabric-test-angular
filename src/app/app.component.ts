import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //here we will manage the list of the products
  // we will get product from product-create component and pass in to product-list component

  products=[];
  productAdded(product){
    this.products.push(product);
  }
}
