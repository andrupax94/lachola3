import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class authGuard implements CanActivate {
    constructor(private router: Router, private http: HttpClient) {

    }
    getToken(): Observable<any> {
        const tokenValue = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xhY2hvbGEuYW5kcmVzZWR1YXJkby5lcyIsImlhdCI6MTcwNTI2MzE2MSwibmJmIjoxNzA1MjYzMTYxLCJleHAiOjE3MDU4Njc5NjEsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.O5O7gJJiEqRf4bKuxqJCDw0h9Ye2k5Iw3m2ObqSyoE4';
        let bearerP = new HttpParams({ fromString: 'name=term' }).set('token', tokenValue);
        const url = 'http://lachola.test/api/getToken';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, bearerP, { observe: 'response', withCredentials: true });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return new Promise<boolean | UrlTree>((resolve, reject) => {
            let isLoggedIn: string | boolean | null = localStorage.getItem('user');
            const params = new HttpParams({ fromString: 'name=term' });

            this.getToken().subscribe({
                next: (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');

                    if (data.body !== true) {
                        return false;
                    }
                    else {
                        return true;
                    }

                },
                error: (error) => {

                }
            });

        });
    }
}

