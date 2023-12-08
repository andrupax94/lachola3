import { Directive,ElementRef,Input } from '@angular/core';
import { MensajesService } from 'src/factory/mensajes.service';


@Directive({
  selector: '[fileRead]'
})
//desconocimiento parcial de uso pero en principio lo agregas a un elemento input filey luego lo manda a una funcion
// dentro del fileread ejemplo:fileread="miFuncion" luego la funcion seria asi :"function miFuncion(file)" donde file es el base64
// si todo salio bien
export class FileReadDirective {

@Input() fileRead:any;
  private static file=new Array;
  constructor(private ElementRef:ElementRef,private mensaje:MensajesService) {
  }
  ngOnInit() {
    let fileReadF=this.fileRead;
    let element:any=$(this.ElementRef.nativeElement);
    let mensaje=this.mensaje;
    let attrs:any;
    attrs={
      fileread:element.attr('[fileRead]'),
    };

    let i:any = new Image();
            if (attrs.fileread !== undefined && attrs.fileread !== "") {

               i.onload = function() {
                  $('#imagen').attr('dimenciones', i.height + ',' + i.width);
               };
               i.src = attrs.fileread;
            }

            element.bind("change", function(changeEvent:any) {
               var reader = new FileReader();
               var aux = changeEvent.target.files[0].name.split('.');
               var size = changeEvent.target.files[0].size;
               var extencion = aux[aux.length - 1];
               var validaraux = element;
               var aprobado = true;
               reader.onload = function(loadEvent) {

                  if (validaraux.attr('imagen-width') || validaraux.attr('imagen-height') || validaraux.attr('imagen-size')) {

                     i.onload = function() {

                        var image:any = [];
                        image.height = i.height;
                        image.width = i.width;
                        if (validaraux.attr('imagen-width')) {
                           var imagewidth = validaraux.attr('imagen-width').split(',');
                           if (image.width < imagewidth[0] || image.width > imagewidth[1]) {
                              mensaje.add('El Ancho De Imagen No Cumple', 'warning');
                              element.attr('aprobado', 'no');
                              aprobado = false;
                           }
                        }
                        if (validaraux.attr('imagen-height')) {
                           var imageheight = validaraux.attr('imagen-height').split(',');
                           if (image.height < imageheight[0] || image.height > imageheight[1]) {
                              mensaje.add('El alto De Imagen No Cumple', 'warning');
                              element.attr('aprobado', 'no');
                              aprobado = false;
                           }
                        }
                        if (validaraux.attr('imagen-size')) {
                           var imagesize = validaraux.attr('imagen-size');

                           if (parseInt(size) > parseInt(imagesize)) {
                              mensaje.add('El Tamaño De La Imagen No Cumple', 'warning');
                              element.attr('aprobado', 'no');
                              aprobado = false;
                           }
                        }
                        if (aprobado === true) {
                          element.attr('aprobado', 'si');
                          fileReadF(loadEvent.target?.result);
                          FileReadDirective.file.push({'name':element.attr('fileRead'),'base64':loadEvent.target?.result});

                        }


                     };
                     i.src = loadEvent.target?.result;
                  } else {
                        element.attr('aprobado', 'si');
                        fileReadF(loadEvent.target?.result);
                        FileReadDirective.file.push({name:element.attr('fileRead'),base64:loadEvent.target?.result});
                  }
               }



               if (validaraux.attr('imagen-extencion')) {
                  var extensiones = validaraux.attr('imagen-extencion').split(',');
                  var extencionescontador = 0;
                  for (var x = 0; x < extensiones.length; x++) {
                     if (extencion !== extensiones[x]) {
                        extencionescontador++;
                     }
                  }
                  if (extencionescontador === extensiones.length) {
                     mensaje.add('Extencion No Permitida', 'warning');
                     element.attr('aprobado', 'no');
                  } else {

                     reader.readAsDataURL(changeEvent.target.files[0]);
                  }
               } else {

                  reader.readAsDataURL(changeEvent.target.files[0]);
               }


            });


  }



}
