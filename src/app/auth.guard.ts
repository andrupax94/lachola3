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

        let params = new HttpParams({ fromString: 'name=term' });
        const url = 'http://lachola.test/api/getToken';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
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
                        //TODO posigue ejecutar getUser del back
                        localStorage.setItem('user', data);
                        isLoggedIn = localStorage.getItem('user');
                        return true;
                    }

                },
                error: (error) => {

                }
            });

        });
    }
}

