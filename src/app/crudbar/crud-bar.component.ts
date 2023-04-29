import { Component } from "@angular/core";

@Component({
  selector:'app-crudbar',
  templateUrl: './crud-bar.component.html',
  styleUrls: ['./crud-bar.component.css']

})
export class crudBarComponent{
  openPopup: boolean;
  onAddClick(){
    this.openPopup = !this.openPopup;
  }
}
