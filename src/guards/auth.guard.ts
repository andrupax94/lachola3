import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from 'src/factory/session.service';
import { Location } from '@angular/common';
@Injectable({
    providedIn: 'root',
})
export class authGuard implements CanActivate {

    constructor(private router: Router, private http: HttpClient, private session: SessionService, private location: Location) {

    }
    public reload() {
        window.location.reload();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return new Promise<boolean | UrlTree>((resolve, reject) => {
            let isLoggedIn: string | boolean | null = localStorage.getItem('user');
            const params = new HttpParams({ fromString: 'name=term' });
            let user = { state: false, data: [], mensaje: '' }
            return this.session.getToken().subscribe({
                next: (data) => {
                    if (data.body !== true) {

                        user.mensaje = "Error Al Iniciar Sesion";
                        this.session.SetUserCookie(user);
                        this.router.navigate(['logIn']);
                        resolve(true);

                    }
                    else {
                        this.session.getUser().subscribe({
                            next: (data) => {

                                if (data.body.username === null) {
                                    user.mensaje = "No hay datos de usuario";
                                    this.session.SetUserCookie(user);
                                    this.router.navigate(['logIn']);
                                    resolve(true);
                                }
                                else {
                                    user.mensaje = "Iniciado Correctamente";
                                    user.state = true;
                                    user.data = data.body;
                                    this.session.SetUserCookie(user);
                                    resolve(true);
                                }

                            },
                            error: (error) => {
                                user.mensaje = "Error Al Obtener Datos De Usuario";
                                this.session.SetUserCookie(user);
                                this.router.navigate(['logIn']);
                                resolve(true);
                            }
                        });


                    }

                },
                error: (error) => {
                    user.mensaje = error;
                    this.session.SetUserCookie(user);
                    this.router.navigate(['logIn']);
                    resolve(true);
                }
            });

        });
    }
}

