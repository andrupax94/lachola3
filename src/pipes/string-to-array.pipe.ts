import { Pipe, PipeTransform } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Pipe({
  name: 'stringToArray'
})
export class StringToArrayPipe implements PipeTransform {
  constructor(private andres:FactoryService){}
  //la funcion "stringToArray" convierte un string a un array separado por defecto con un "," por ejemplo "[[(joder-joder2|stringToArray:'-')]]"
// lo convertira en un array posiblemente para un uso en un ng-repeat
  transform(value: string, separator: string=','): unknown {

      if (typeof(value) === 'string') {
         return this.andres.stringToArray(value, separator);
      } else {
         return "Not is String";
      }

  }

}
