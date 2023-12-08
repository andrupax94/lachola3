import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rellenarConCeros'
})
export class RellenarConCerosPipe implements PipeTransform {

  transform(valor:string|number, cerosIni: number=10): unknown {
    // funcion que rellena con ceros un numero hasta que la cantidad de digitos sea 10 creo que lo usaba para facturas

          var length = valor.toString().length;
          var numerodeceros = cerosIni - length;
          if (numerodeceros >= 0) {
             var ceros = "";
             for (var i = 0; i < numerodeceros; i++) {
                ceros = ceros + '0';
             }

             return ceros + valor;
          } else {
             return valor;
          }
       }

}
