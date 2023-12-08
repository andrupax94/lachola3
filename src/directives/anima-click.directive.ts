import { Directive, ElementRef, Input } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';
type typeOpc='click'|'hover'|'cli-hov';
type Opciones=[type:typeOpc,activador:string,sw:boolean,animation1?:string,animationTime?:number];
@Directive({
  selector: '[anima]'
})
export class AnimaDirective {
  @Input('anima') type:Opciones=['click','',false,'',0];

  constructor(private element:ElementRef,private factory:FactoryService) {

   }
   ngOnInit(){
    let activador=this.type[1];
    let attr=$(this.element.nativeElement).attr('id');
    let sw=this.type[2];
  if(attr===undefined)
    attr=this.factory.generaID(this.element.nativeElement);

  let elementoAnimar=$('#'+attr);
 if(this.type[3]!==undefined){
  $('#'+attr).css('animation-name',this.type[3]);
  $('#'+attr).css('-webkit-animation-name',this.type[3]);
 }
 $('#'+attr).css('animation-duration',(this.type[4]===undefined)?0:this.type[4]+'s');
 $('#'+attr).css('-webkit-animation-duration',(this.type[4]===undefined)?0:this.type[4]+'s');
 elementoAnimar.attr('anima','');

  if(activador!==''){
  const miElemento = document.getElementById(activador);
  switch(this.type[0]){
    case 'click':
      miElemento?.addEventListener('click',(()=>{
        this.factory.anima('#'+attr);
      }));
      break;
    case 'hover':
      let swTO=false;
      let hoverEntrada=()=>{
        swTO=true;
        if(sw===false){
          this.factory.anima('#'+attr);
          sw=true;
        }

      };
      let hoverSalida=()=>{
        swTO=false;
        setTimeout(()=>{
          if(swTO===false&&sw===true){
          this.factory.anima('#'+attr);
          sw=false;
          swTO=false;
          }
        },300);
      };
      elementoAnimar.eq(0)[0].addEventListener('mouseenter',hoverEntrada);
      miElemento?.addEventListener('mouseenter',hoverEntrada);
      elementoAnimar.eq(0)[0].addEventListener('mouseleave',hoverSalida);
      miElemento?.addEventListener('mouseleave',hoverSalida);
      miElemento?.addEventListener('click',()=>{
        if(sw===true){
        this.factory.anima('#'+attr);
          sw=false;
          swTO=false;
        }
        else
        hoverEntrada();
      });
      break;
  }

   }
  }
}
