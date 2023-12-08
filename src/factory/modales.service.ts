import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalesService {

  constructor() {
    this.activo=false;
    this.pregunta.aceptar= () => {
      this.cerrar(true);
      this.callback();
   }
   this.pregunta.activo = false;
   this.pregunta.h3 = 'Desea Continuar?';
   this.pregunta.info = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum haum.';
  }
    public activo:boolean;
    public pregunta:any = [];
    private callback () {
       console.log('Sin Callback');
    }
    private callback2 () {
       console.log('Sin Callback');
    }
    public cerrar (callB:boolean=false) {
       $('#modal').fadeOut(200, ()=> {
          this.activo = false;
          if(!callB)
          this.callback2();
          this.pregunta.activo = false;
       });
    }
    public abrirPregunta (h3:string, info:string, callback:VoidFunction=()=>{}, callback2:VoidFunction=()=>{}) {
       this.pregunta.h3 = h3;
       this.pregunta.info = info;
       this.callback = callback;
       if (callback2 !== undefined) {
          this.callback2 = callback2;
       }
       this.activo = true;
       this.pregunta.activo = true;
       $('#modal').fadeIn(200);
    }
}
