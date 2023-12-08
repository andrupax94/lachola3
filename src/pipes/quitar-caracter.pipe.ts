import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quitarCaracter'
})
export class QuitarCaracterPipe implements PipeTransform {

  transform(valor:string , caracter: string): unknown {
         var aux = valor.toString().replace(caracter, "");
         return aux;

  }

}
