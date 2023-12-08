import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precio'
})
export class PrecioPipe implements PipeTransform {

  transform(valor: string|number|Array<string>): unknown {
    // muestra un valor como si fuera un precio final en alguna factura ejemplo "[['24'|precio]]" devolvera 24,00
     var cedulaconpuntos = "";
     valor = valor.toString();
     if (valor.indexOf(',')) {
        valor = valor.replace(",", ".");
     }
     valor = valor.split('.');

     if (valor[1] === undefined) {
        valor = valor[0];
        var decimales = ",00";
     } else {

        if (valor[1].length < 2) {
           var decimales = ',' + valor[1][0] + '0';
        } else {
           var decimales = ',' + valor[1][0] + valor[1][1];
        }
        valor = valor[0];
     }
     var x = valor.length;

     while (x >= 0) {

        if (x === 1) {
           cedulaconpuntos = valor[0] + cedulaconpuntos;
        }
        if (x === 2) {
           cedulaconpuntos = valor[0] + valor[1] + cedulaconpuntos;
        }
        if (x === 3) {
           cedulaconpuntos = valor[0] + valor[1] + valor[2] + cedulaconpuntos;
        }


        if (x > 3) {

           cedulaconpuntos = '.' + valor[x - 3] + valor[x - 2] + valor[x - 1] + cedulaconpuntos;


        }
        x--;
        x--;
        x--;

     }

     return (cedulaconpuntos + decimales);
  }



}
