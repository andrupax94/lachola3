import { Directive, ElementRef, Input } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Directive({
  selector: '[placeHolderTop]'
})
//funcion que hace una pequeña animacion del texto que deberia ir en placeholder hacia arriba del elemento ejemplo:"placeholdertop='Coloque su nombre'"

export class PlaceHolderTopDirective {
  @Input() placeHolderTop?:string;
  private icon?:string;
  constructor(private ElementRef:ElementRef,private andres:FactoryService) {
    let element=$(this.ElementRef.nativeElement);
    let height;
    let width;
    let attrs:any;
    attrs={
    placeHolderTop:element.attr('placeHolderTop'),
    icon:element.attr('icon'),
    ngModel:element.attr('ngModel'),
    ngChange:element.attr('ngChange'),
    };
    setTimeout(() => {
          element.addClass('placeholderTopI');
          height = element.css('height');
          element.parent().children('*');
          attrs.icon = (attrs.icon == undefined ? "" : attrs.icon);
          attrs.ngModel = (attrs.ngModel == undefined ? "" : attrs.ngModel);
          attrs.ngChange = (attrs.ngChange == undefined ? "" : attrs.ngChange);
          var bg = element.css('background-color');
          var attr = element.attr('id');
          if (attr === undefined) {
             attr = andres.generaRandomString(8);
             while ($('#' + attr + '').length > 0) {
              attr = andres.generaRandomString(8);
             }
             element.attr('id', attr);
          }
          if (attrs.icon !== "") {
             attrs.icon = '<i class="placeholderTopIcon bi ' + attrs.icon + '"></i>';
          }
          var h5 = '';
          if (element[0].tagName !== 'SELECT')
             h5 = '<div class="placeholderTopD"><h5>' + attrs.placeHolderTop + '</h5></div>';
          var hermano = $(element[0]).next();
          var html = '<div id="' + attr + '_parent" class="placeholderTopC">' + attrs.icon + h5 + '</div>';
          if (hermano.length >= 1)
             hermano.before(html);
          else
             element.parent().append(html);
          var string = element.attr('class');
          const regularExp = /\bcol-(([0-9]|1[1-2])\b|(sm|md|lg|xl)-([0-9]|1[1-2]))\b/g;
          const array = string?.match(regularExp);
          var nuevoDiv = $('#' + attr + '_parent');
          if (array !== null) {
             array?.forEach(element2 => {
                nuevoDiv.addClass(element2);
                element.removeClass(element2)

             });
          }

          nuevoDiv.children('div').css('height', nuevoDiv.css('height'));
          nuevoDiv.css('top', element.css('top'));
          nuevoDiv.css('left', element.css('left'));
          nuevoDiv.css('rigth', element.css('rigth'));
          nuevoDiv.css('bottom', element.css('bottom'));
          nuevoDiv.css('position', element.css('position'));
          bg.indexOf('rgba(0, 0, 0, 0)', 0) != -1 ? bg = 'white' : element.css('background-color');
          element.appendTo(nuevoDiv);
          nuevoDiv.children('div').children('h5').eq(0).css('font-family', element.css('font-family'));
          nuevoDiv.children('div').children('h5').eq(0).css('font-size', element.css('font-size'));
          nuevoDiv.children('div').children('h5').eq(0).css('background', bg);
          if (attrs.icon !== "") {
             element.addClass('placeholderTopIicon');
             nuevoDiv.children('div').eq(0).css('left', '22px');
          }
          if (element.val() != "") {
             andres.focusPlaceholderTop(undefined, nuevoDiv);
          }


          nuevoDiv.children('input').focus(function(e) {
             andres.focusPlaceholderTop(e, nuevoDiv);
          });
          nuevoDiv.children('input').focusout(function(e) {
             andres.focusoutPlaceholderTop(e, nuevoDiv);
          });

       },
       1000);
   }


}
