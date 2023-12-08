import { SessionService } from './session.service';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
type menu=Array<{title:string,icon:string,state:boolean,function:()=>Promise<string|boolean>|void}>;
@Injectable({
  providedIn: 'root'
})
export class MenusService {
  menu1: menu = [];
  categories:menu=[];
  legal: menu = [];
  social: menu = [];
  headerUsuarioIniciado:menu=[];
  headerUsuarioNoIniciado:menu=[];
changePage(ruta:string){
    this.router.navigate([ruta]);
  }
changePageOut(ruta:string){
    window.open(ruta, '_blank');
  }


  constructor(session:SessionService,private router:Router) {
    this.menu1[0]={title:'inicio',icon:"icons/home.svg",state:false,function:()=>this.changePage("/i")};
    this.menu1[1]={title:'tienda',icon:"icons/store.svg",state:false,function:()=>this.changePage("/i/store")};
    this.menu1[2]={title:'servicios',icon:"icons/services.svg",state:false,function:()=>this.changePage("/i/services")};
    this.menu1[3]={title:'contacto',icon:"icons/contact.svg",state:false,function:()=>this.changePage("#contact")};
    this.menu1[4]={title:'nosotros',icon:"logo1.svg",state:false,function:()=>this.changePage("/i/about")};
    this.headerUsuarioIniciado[0]={title:'ajustes',icon:"icons/settings.svg",state:false,function:()=>this.changePage("/i/user/settings")};
    this.headerUsuarioIniciado[1]={title:'carrito',icon:"icons/hCarrito.svg",state:false,function:()=>this.changePage("/i/shoppingCar")};
    this.headerUsuarioIniciado[2]={title:'Cerrar Sesion',icon:"icons/logOut.svg",state:false,function:()=>session.logOut()};
    this.headerUsuarioNoIniciado[0]={title:'Iniciar Sesion',icon:"icons/logIn.svg",state:false,function:()=>this.changePage("/i/user/logIn")};
    this.headerUsuarioNoIniciado[1]={title:'Registrarse',icon:"icons/signIn.svg",state:false,function:()=>this.changePage("/i/user/register")};
    this.legal[0]={title:'Terminos y Condiciones',icon:"",state:false,function:()=>this.changePage("/i/legal/terms")};
    this.legal[1]={title:'Politicas De Privacidad',icon:"",state:false,function:()=>this.changePage("/i/legal/privacy")};
    this.legal[2]={title:'Politica De Compra/Venta',icon:"",state:false,function:()=>this.changePage("/i/legal/sells")};
    this.legal[3]={title:'Politica De Envios',icon:"",state:false,function:()=>this.changePage("/i/legal/shipping")};
    this.legal[4]={title:'Politica De Cookies',icon:"",state:false,function:()=>this.changePage("/i/legal/cookies")};
    this.legal[5]={title:'Politica De Devoluciones',icon:"",state:false,function:()=>this.changePage("/i/legal/return")};
    this.social[0]={title:'Facebook',icon:"/icons/fFacebook.svg",state:false,function:()=>this.changePageOut("google.com")};
    this.social[1]={title:'WhatApp',icon:"/icons/fWhatApp.svg",state:false,function:()=>this.changePageOut("google.com")};
    this.social[3]={title:'Instagram',icon:"/icons/fInstagram.svg",state:false,function:()=>this.changePageOut("google.com")};
    this.social[2]={title:'X',icon:"/icons/fTwitter.svg",state:false,function:()=>this.changePageOut("google.com")};
    this.social[4]={title:'Gmail',icon:"/icons/fGmail2.svg",state:false,function:()=>this.changePageOut("google.com")};
    this.categories[0]={title:'casual',icon:"/icons/casual.svg",state:false,function:()=>this.changePage("/i/store/casual")};
    this.categories[1]={title:'formal',icon:"/icons/formal.svg",state:false,function:()=>this.changePage("/i/store/formal")};
    this.categories[3]={title:'deportiva',icon:"/icons/deportiva.svg",state:false,function:()=>this.changePage("/i/store/sportswear")};
    this.categories[2]={title:'intima',icon:"/icons/intima.svg",state:false,function:()=>this.changePage("/i/store/underwear")};
    this.categories[4]={title:'dormir',icon:"/icons/dormir.svg",state:false,function:()=>this.changePage("/i/store/sleepwear")};
    this.categories[5]={title:'playera',icon:"/icons/playera.svg",state:false,function:()=>this.changePage("/i/store/beachclothing")};






}


}
