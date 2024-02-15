import { Injectable } from '@angular/core';
import { interval, from, timer } from 'rxjs';
import { switchMap, delay, take, concatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class MensajesService {

    constructor() {

    }

    private static mensaje: any = [];
    public get getMensajes(): any {
        return MensajesService.mensaje;
    }

    async anima(index: number) {
        const i = index - 1;

        // Encadenar animaciones con RxJS
        interval(200).pipe(
            take(1),
            concatMap(() => from(this.animateElement($('#mensajes>div[index="' + i + '"]'), 0, 0.5))),
            delay(500),
            concatMap(() => from(this.animateElement($('#mensajes>div[index="' + i + '"]>div>div:first-child'), 0, 0.5))),
            delay(6000),
            concatMap(() => from(this.animateElement($('#mensajes>div[index="' + i + '"]>div>div:first-child'), 300, 0.5))),
            delay(500),
            concatMap(() => from(this.animateElement($('#mensajes>div[index="' + i + '"]'), 300, 0.5))),
        ).subscribe(() => {
            // Animaciones completadas
            // Realizar cualquier acción adicional aquí, como eliminar el mensaje
            MensajesService.mensaje.splice(0, 1);

        });
    }

    private animateElement(element: any, value: number, duration: number): Promise<void> {
        return new Promise<void>((resolve) => {
            $(element).animate(
                { left: `${value}px` },
                { duration: duration * 1000, complete: () => resolve() }
            );
        });
    }

    public add(tipo: string, text: string) {
        switch (tipo) {
            case 'info':
                tipo = 'mensajeInfo';
                break;
            case 'warning':
                tipo = 'mensajeWarning';
                break;
            case 'error':
                tipo = 'mensajeError';
                break;
            case 'ok':
                tipo = 'mensajeOk';
                break;
        }
        MensajesService.mensaje.push({ 'tipo': tipo, 'text': text, 'index': MensajesService.mensaje.length });
        // this.chRef.detectChanges();
        var index = MensajesService.mensaje.length;

        this.anima(index);
    }

}
