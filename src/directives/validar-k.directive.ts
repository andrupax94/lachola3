import { Directive, ElementRef, Input } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Directive({
  selector: '[validarK]'
})
//funciona similar a la directiva anterior solo que aca la manera como va a validar no va a ser por atributos añadidos sino dentro del mismo atributo validark
// ejemplo:'validark="alfanumerico"' esto hara que solo se puedan colocar valores alfanumericos al momento de presionar cada tecla
export class ValidarKDirective {

  constructor(private ElementRef:ElementRef,private andres:FactoryService) {
    let element:any=$(ElementRef.nativeElement);
      let attrs:any;
      attrs={
      validarK:element.attr('validarK'),
      };
      //TODO sdfsdf
      element.keypress((e:KeyboardEvent) =>{
         var tipovalidacion = attrs.validarK;
         var codigo:any = e.which;
         codigo = String.fromCharCode(codigo);
         var permitidos = "";
         var aprobado = "no";
         switch (tipovalidacion) {
            case 'numerico':
               permitidos = "1234567890";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               break;
            case 'alfa':
               permitidos = "qwertyuiopasdfghjklñzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               if (codigo[0] === "") {
                  aprobado = "no";
               }
               break;
               case 'alfaMayus':
                permitidos = " QWERTYUIOPASDFGHJKLÑZXCVBNM";
                for (var i = 0; i < permitidos.length; i++) {
                   if (codigo === permitidos[i]) {
                      aprobado = "si";
                   }
                }
                if (codigo[0] === "") {
                   aprobado = "no";
                }
                break;
            case 'alfaparentesis':
               permitidos = "qwertyuiopasdfghjklñzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM()";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               if (codigo[0] === "") {
                  aprobado = "no";
               }
               break;
            case 'alfanumericoparentesis':
               permitidos = "qwertyuiopasdfghjklñzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM1234567890()";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               if (codigo[0] === "") {
                  aprobado = "no";
               }
               break;

            case 'alfanumerico':
               permitidos = "qwertyuiopasdfghjklñzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM1234567890@.";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               if (codigo[0] === "") {
                  aprobado = "no";
               }
               break;
            case 'alfanumericosimbolos':
               permitidos = "qwertyuiopasdfghjklzxcñvbnm QWERTYUIOPASDFGHÑJKLZXC@VBNM1234567890!#&/%()'=-_¡¿|°.,";
               for (var i = 0; i < permitidos.length; i++) {
                  if (codigo === permitidos[i]) {
                     aprobado = "si";
                  }
               }
               if (codigo[0] === "") {
                  aprobado = "no";
               }
               break;
            case 'decimal':
               aprobado = "si";

               if (e.which !== 46) {
                  if (e.which !== 8)
                     if (isNaN(codigo)) {
                        aprobado = "no";
                     }
               } else {
                  if (element.val().indexOf('.') !== -1 || element.val().length < 1) {
                     aprobado = "no";
                  }
               }
               break;
            case 'medida':
               aprobado = "si";
               var iox = element.val().split('x');
               var leg = element.val().length;
               var medida = element.attr('medida');
               if (e.which !== 120) {
                  if (e.which !== 8)
                     if (isNaN(codigo)) {
                        aprobado = "no";
                     }

               } else {


                  iox.forEach((nElement:any) => {
                     if (nElement === '' || iox.length >= parseInt(medida)) {
                        aprobado = "no";
                     }
                  });


               }
               break;
            case '':
               aprobado = "si";
               break;
         }
         if (element.attr('maxlength') !== undefined) {
            if (element.val().length + 1 > element.attr('maxlength')) {
               aprobado = 'no';
            }
         }
         if (element.attr('max') !== undefined) {
            console.log(element.val() + codigo);
            if (parseInt(element.val() + codigo) > element.attr('max')) {
               aprobado = 'no';
            }
         }
         if (element.val().length < 1 && codigo === " ") {
            aprobado = 'no';

         }
         if (aprobado === "no") {
          e.preventDefault();
            return false;
         }
         else{
          return true;
         }
      });
   }


}
