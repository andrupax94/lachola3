import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
// es un intento de split rapido con filters por ejemplo "[['hola-hola2'|split:'-',0]]" separara el texto 'hola-hola2' por los "-"
// y mostrara el valor de la posiciopn 0 que seria "hola"
  transform(value: string, splitChar: string,splitIndex:number): unknown {
      return value.split(splitChar)[splitIndex];
  }

}
