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
      element.append('<div style="display:none" cargan="' + i + '" class="carga ' + clase + '">' +
         '<div>' +
         '<div>' +
         '<div></div>' +
         '</div>' +
         '</div>' +
         '</div>');

      this.tl1[i] = gsap.timeline({
         repeat: -1,
         paused: true
      });
      this.tl2[i] = gsap.timeline({
         repeat: -1,
         paused: true
      });
      this.tl3[i] = gsap.timeline({
         repeat: -1,
         paused: true
      });
      element.children('*').css('visibility', 'visible');

      setTimeout(() => {
         element.children('.carga').css('border-radius', element.css('border-radius'));
         if (opacity) {
            element.children('.carga').css('background-color', '#ffffff80');
         }

         var cargaButton = element.find('.cargaButton').eq(0);
         cargaButton.click(function(e:any) {
            e.stopPropagation();

         });

      }, 200);
   }

   public play (element:any=this.actualElement) {

      if (!this.switch) {
         if (element === undefined) {
            var element = this.elementS[this.elementS.length - 1];
         }
         var i = parseInt(element.find('.carga').eq(0).attr('cargan'));
         element.find('.carga').show();
         setTimeout(()=> {
            this.switch = true;
            var children = this.elementS[i].children('.carga').children('div');
            var children2 = this.elementS[i].children('.carga').children('div').children('div');
            var children3 = this.elementS[i].children('.carga').children('div').children('div').children('div');
            this.tl1[i].to(children, {
               duration: 2,
               ease: "linear",
               rotate: 360
            });
            this.tl2[i].to(children2, {
               duration: 1,
               ease: "linear",
               top: "-" + (this.size - 30) + "px"
            }).to(children2, {
               duration: 1,
               ease: "linear",
               top: "-" + this.size + "px"
            });
            this.tl3[i].to(children3, {
               top: (this.size - 30) + "px",
               ease: "linear",
               duration: 1

            }).to(children3, {
               top: this.size + "px",
               ease: "linear",
               duration: 1
            });
            this.tl1[0].play();
            this.tl2[0].play();
            this.tl3[0].play();
         }, 200);

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
            this.tl1[i].pause();
            this.tl2[i].pause();
            this.tl3[i].pause();
            $('header,main,footer').removeClass('sHidden');
            this.elementS[i].children('.carga').remove();
            this.elementS.splice(i, 1);
         }, 500);
      }
   }
}
