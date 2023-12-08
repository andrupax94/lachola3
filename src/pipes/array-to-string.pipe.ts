import { Pipe, PipeTransform } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Pipe({
  name: 'arrayToString'
})
export class ArrayToStringPipe implements PipeTransform {
constructor(private andres:FactoryService){}
  transform(valor: Array<any>, separator:string=','): unknown {
//hace lo contrario quela funcion anterior aunque no entiendo muy bien el proque manda un tercer valor a la funcion "arraytostring"
//cuando valor[0] es un objeto, un ejemplo de este filtro seria "[[['hola','hola2']|arrayToString:'-']]"

     if (valor !== undefined) {
        if (valor.length === 1)
           return this.andres.arrayToString(valor, separator);
        else {
           if (typeof valor[0] === 'object')
              return this.andres.arrayToString(valor[0], separator, valor[1]);
           else {
              return this.andres.arrayToString(valor, separator);
           }
        }
     } else {
        return 'Not is Array';
     }

  }

}
