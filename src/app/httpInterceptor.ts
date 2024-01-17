import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MensajesService } from '../factory/mensajes.service';
import { CargaService } from '../factory/carga.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private mensajes: MensajesService, private carga: CargaService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // Manejar los errores aquí
                console.error('Error en la solicitud:', error);

                // Puedes lanzar un nuevo error o devolver un mensaje personalizado
                return throwError('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.');
            })
        );
    }
}
