import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.module";
import { Subject } from "rxjs";

@Injectable({providedIn:'root'})
export class AuthService{

  isAuthenticated = false;
  private token : string;
  private tokenTimer : NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http : HttpClient, private router : Router){}

  getToken(){
    return this.token;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getIsAuth(){
    return this.isAuthenticated;
  }

  createUser(email : string, password: string){
    const authData : AuthData = {
      email : email,
      password: password
    };
    this.http.post('http://localhost:3000/user/signup', authData)
    .subscribe(response =>{
      console.log(response);
    });
  }


  login(email: string, password: string){
    const authData : AuthData = {
      email : email,
      password: password
    };
    this.http.post<{token : string, expiresIn : number}>('http://localhost:3000/user/login', authData)
    .subscribe(response =>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiry = response.expiresIn;
        this.setAuthTimer(expiry);
        this.isAuthenticated = true;
        const now = new Date();
        const expiryDate = new Date(now.getTime() + expiry*1000);
        this.saveAuthData(token,expiryDate);
        this.authStatusListener.next(true);
        this.router.navigate(["/"]);
      }
    });
  }
  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiryDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);

  }

  private setAuthTimer(duration : number){
    console.log('setting timer: '+ duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

  private saveAuthData(token : string, expiryDate : Date){
    localStorage.setItem('token' , token);
    localStorage.setItem('expiration',expiryDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiration');
    if(!token && !expiryDate){
    return;
    }
    return ({
      token: token,
      expiryDate: new Date(expiryDate)
    });
  }
}
