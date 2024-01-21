import { Injectable, ElementRef } from '@angular/core';
import { MensajesService } from './mensajes.service';

@Injectable({
    providedIn: 'root'
})
export class CargaService {

    constructor(private mensaje: MensajesService) {
        this.info = 'Cargando';
    }

    private switch = false;
    private elementS: any = [];
    private size: any;
    private actualElement: any;
    private timeout: any;
    private info: string;

    public error(error: string = 'Ha Ocurrido Un Error Inesperado') {
        this.mensaje.add('error', error);
    }
    public to(element: any, size: string = 'mid', opacity?: boolean) {
        this.info = "Cargando";
        element = $(element);
        this.actualElement = element;
        switch (size) {
            case 'big':
                var clase = "cargaBig";
                this.size = 96;
                break;
            case 'mid':
                var clase = "cargaMid";
                this.size = 66;
                break;
            case 'small':
                var clase = "cargaSmall";
                this.size = 36;
                break;
            default:
                var clase = "cargaBig";
                this.size = 96;
                break;
        }
        this.elementS.push(element);
        var i = this.elementS.length - 1;
        element.append('<div class="carga" cargan="' + i + '"><div><div></div><h5>' + this.info + '</h5></div</div>');
        element.children('*').css('visibility', 'visible');


    }
    public changeInfo(element: any = this.actualElement, info: string) {
        let cargaElement = element.find('.carga').eq(0);
        let h5html = cargaElement.find('h5').eq(0);
        $(h5html).html(info);
        console.log(h5html);

    }
    public play(element: any = this.actualElement) {

        if (!this.switch) {
            if (element === undefined) {
                var element = this.elementS[this.elementS.length - 1];
            }
            var i = parseInt(element.find('.carga').eq(0).attr('cargan'));
            element.find('.carga').show();

        }
    }
    private pauseTimeOut = setTimeout(() => {

    }, 200);
    public pause(element: any = this.actualElement) {
        clearTimeout(this.timeout);
        clearTimeout(this.pauseTimeOut);
        this.switch = false;
        if (element === undefined) {
            var element = this.elementS[this.elementS.length - 1];
        }
        try {
            var i = parseInt(element.find('.carga').eq(0).attr('cargan'));
            this.pauseTimeOut = setTimeout(() => {
                $('header,main,footer').removeClass('sHidden');
                this.elementS[i].children('.carga').remove();
                this.elementS.splice(i, 1);
            }, 500);
        } catch (error) {

        }


    }
}
