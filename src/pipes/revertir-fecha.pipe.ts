import { Pipe, PipeTransform } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Pipe({
  name: 'revertirFecha'
})
export class RevertirFechaPipe implements PipeTransform {
  constructor(private factory:FactoryService){}
// la uso cara revertir la fecha cuando el formato es "año/dia/mes" o "año/mes/dia"
// y convertirlo en "dia/mes/año"
  transform(value: string): unknown {

      if (value !== undefined && value !=='') {
         let fecha:any;

         if (this.factory.convertTZ(value) === 'Invalid Date') {
            let aux = value;
            dashOrSplice();
            fecha = fecha[1] + '/' + fecha[2] + '/' + fecha[0];
            const regext = new RegExp(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/, "g");
            if (regext.test(fecha))
               return fecha;
            else
               return 'Invalid Date';
         } else {
            var aux = this.factory.convertTZ(value);
            aux = aux.split(',')[0];
            dashOrSplice();
            fecha = fecha[0] + '/' + fecha[1] + '/' + fecha[2];
         }

         function dashOrSplice() {
            if (aux.indexOf('/') !== -1) {
               fecha = aux.split('/');
            } else if (aux.indexOf('-') !== -1) {
               fecha = aux.split('-');
            }
         }
         return (fecha);
      } else {
         return 'Invalid Date';
      }

  }

}
