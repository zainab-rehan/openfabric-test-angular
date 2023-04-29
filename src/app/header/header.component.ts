import { Component } from "@angular/core";

@Component({
  selector:'app-header',
  templateUrl:'./header.component.html',
  styleUrls:['./header.component.css']

})
export class HeaderComponent{
  onMenuClick(){
    alert("Under Construction");
  }
  onCallClick(){
    alert("Contact");
  }
  onAccountClick(){
    alert("Sign In / Sign Up");
  }
}
