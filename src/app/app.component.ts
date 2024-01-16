import { HttpClient, HttpClientXsrfModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'lachola';

    public user: string | null;
    constructor(private http: HttpClient) {

        this.user = localStorage.getItem('user');
    }
    realizarSolicitudPost(): Observable<any> {
        const tokenValue = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xhY2hvbGEuYW5kcmVzZWR1YXJkby5lcyIsImlhdCI6MTcwNTI2MzE2MSwibmJmIjoxNzA1MjYzMTYxLCJleHAiOjE3MDU4Njc5NjEsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.O5O7gJJiEqRf4bKuxqJCDw0h9Ye2k5Iw3m2ObqSyoE4';
        let bearerP = new HttpParams({ fromString: 'name=term' }).set('token', tokenValue);
        const url = 'http://lachola.test/api/getToken';
        const headers = new HttpHeaders({
            'X-CSRF-TOKEN': 'any'
        });

        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, bearerP, { headers: headers, observe: 'response', withCredentials: true });
    }
    ngOnInit() {
        this.realizarSolicitudPost().subscribe(
            (response) => {
                // Manejar la respuesta exitosa aquí
                const headers = response.headers;
                console.log('Encabezados de respuesta:', response);

                // También puedes acceder a encabezados específicos
                const contentType = headers.get('Content-Type');
                console.log('Tipo de contenido:', contentType);
            }
        );
        setTimeout(() => {
            this.user = localStorage.getItem('user');
        }, 500)
    }
}
