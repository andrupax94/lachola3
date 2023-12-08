import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';
@Directive({
    selector: '[getSvg3]'
})
// segnda verson de getsvg agrega el svg pero con la propiedad mask-image en un elemento img sin ninguna etiqueta
//  dentro nada dentro de el, el elemento tiene que tener un width y height
export class Getsvg3Directive {
    @Input() getSvg3: string = '';
    constructor(private element: ElementRef, private factory: FactoryService,private renderer:Renderer2) {


    }
    ngOnInit() {
        let e = this.element.nativeElement;
            $(e).attr('getSvg3', this.getSvg3);
        this.factory.getsvg(e, '3',this.renderer);
    }
}
