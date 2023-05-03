import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector:'app-signup',
  templateUrl:'./signup.component.html',
  styleUrls:['./signup.component.css']
})
export class SignupComponent{

  isloading=false;

  constructor(public authService: AuthService){}

  onSignup(form : NgForm){
    if(form.invalid){
      return;
    }
    this.isloading=true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
