import { Directive, ElementRef, Input} from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';
import * as $from from 'jquery';
@Directive({
    selector: '[getSvg]',
})
// segnda verson de getsvg agrega el svg pero con la propiedad mask-image en un elemento img sin ninguna etiqueta
//  dentro nada dentro de el, el elemento tiene que tener un width y height
export class GetsvgDirective {

    constructor(
        private element: ElementRef,
        private factory: FactoryService) {
        factory.getsvg(element.nativeElement);
    }

}
