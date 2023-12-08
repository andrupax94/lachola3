import { Directive, Input, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Directive({
    selector: '[inputIcon]'
})
export class InputIconDirective {
    @Input() inputIcon: [string, string?, string?] = ['', '#FFFFFF', '70']; // Ruta al icono
    @HostBinding('class.input-container') containerClass = true;

    constructor(private el: ElementRef, private f: FactoryService,private renderer:Renderer2) {

    }

    ngOnInit() {
        const inputElement = $(this.el.nativeElement);
        const nuevoDiv = $(this.renderer.createElement('div'));
        nuevoDiv.addClass('inputIcon');
        const icon = $(this.renderer.createElement('span'));
        icon.addClass('inputIcon__span');
        icon.appendTo(nuevoDiv);
        inputElement.after(nuevoDiv);
        inputElement.appendTo(nuevoDiv);
        if (this.inputIcon[0].indexOf('assets') === -1)
            this.inputIcon[0] = '/assets/' + this.inputIcon[0];
        icon.css('mask-image', 'url(' + this.inputIcon[0] + ')');
        if (this.inputIcon[1] === undefined)
            this.inputIcon[1] = '#FFFFFF';
        if (this.inputIcon[2] === undefined)
            this.inputIcon[2] = '70%';
        icon.css('mask-size', 'auto ' + this.inputIcon[2] + '%');
        icon.css('-webkit-mask-size', 'auto ' + this.inputIcon[2]);
        icon.css('background-color', this.inputIcon[1]!);

    }
}

