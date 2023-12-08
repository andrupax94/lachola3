import { Injectable } from '@angular/core';
import { MensajesService } from './mensajes.service';
import { gsap } from 'gsap';
@Injectable({
  providedIn: 'root'
})
export class CargaService {

  constructor(private mensaje:MensajesService) {}

   private switch = false;
   private elementS:any = [];
   private size:any;
   private actualElement:any;
   private timeout:any;
   private retryCount = 0;
   private tl1:any = [];
   private tl2:any = [];
   private tl3:any = [];
   private retryFn = undefined;

   public error (error:string='Ha Ocurrido Un Error Inesperado') {
     this.mensaje.add('error',error);
   }
   public to (element:any, size:string='mid', opacity?:boolean) {
    element=$(element);
    this.actualElement=element;
      switch (size) {
         case 'big':
            var clase = "cargaBig";
            this.size = 96;
            break;
         case 'mid':
            var clase = "cargaMid";
            this.size = 66;
            break;
         case 'small':
            var clase = "cargaSmall";
            this.size = 36;
            break;
         default:
            var clase = "cargaBig";
            this.size = 96;
            break;
      }
      this.elementS.push(element);
      var i = this.elementS.length - 1;
      element.append('<div class="carga" cargan="'+i+'"><div></div></div>');
      element.children('*').css('visibility', 'visible');


   }

   public play (element:any=this.actualElement) {

      if (!this.switch) {
         if (element === undefined) {
            var element = this.elementS[this.elementS.length - 1];
         }
         var i = parseInt(element.find('.carga').eq(0).attr('cargan'));
         element.find('.carga').show();

      }
   }
   private pauseTimeOut = setTimeout(()=>{

   },200);
   public pause (element:any=this.actualElement) {
      clearTimeout(this.timeout);
      clearTimeout(this.pauseTimeOut);
      this.retryCount = 0;
      this.switch = false;
      if (element === undefined) {
         var element = this.elementS[this.elementS.length - 1];
      }
      if (element !== undefined) {
         var i = parseInt(element.find('.carga').eq(0).attr('cargan'));
         this.pauseTimeOut = setTimeout(()=> {
            $('header,main,footer').removeClass('sHidden');
            this.elementS[i].children('.carga').remove();
            this.elementS.splice(i, 1);
         }, 500);
      }
   }
}
