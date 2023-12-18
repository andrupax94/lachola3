import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MensajesService {

  constructor() {

   }

  private static mensaje:any=[];
  public get getMensajes():any{
    return MensajesService.mensaje;
  }

  private async anima(index:number) {
    var i = index - 1;
    setTimeout(() => {

          var elimina=this.getMensajes;
          var elem = $('#mensajes>div[index="' + i + '"]')[0];
          var elem2 = $('#mensajes>div[index="' + i + '"]>div>div:first-child')[0];
          gsap.to(elem, {
             duration: 0.5,
             left: 0,
             onComplete: function() {
                gsap.to(elem2, {
                   duration: 0.5,
                   left: 0,
                   delay: 0.5,
                   onComplete: ()=> {
                      setTimeout(()=> {
                         gsap.to(elem2, {
                            duration: 0.5,
                            left: 300,

                            onComplete: ()=> {
                               gsap.to(elem, {
                                  duration: 0.5,
                                  left: 300,
                                  delay: 0.5,
                                  onComplete: ()=> {
                                    MensajesService.mensaje.splice(0, 1);
                                  }
                               });
                            }
                         })
                      }, 6000);
                   }
                });
             }
          })
       },
       200);
 }

  public add(tipo:string, text:string) {
      switch (tipo) {
         case 'info':
            tipo = 'mensajeInfo';
            break;
         case 'warning':
            tipo = 'mensajeWarning';
            break;
         case 'error':
            tipo = 'mensajeError';
            break;
         case 'ok':
            tipo = 'mensajeOk';
            break;
      }
      MensajesService.mensaje.push({ 'tipo': tipo, 'text': text, 'index': MensajesService.mensaje.length });
      // this.chRef.detectChanges();
      var index = MensajesService.mensaje.length;

     this.anima(index);
   }

}
