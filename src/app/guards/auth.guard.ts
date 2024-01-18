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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return new Promise<boolean | UrlTree>((resolve, reject) => {
            let isLoggedIn: string | boolean | null = localStorage.getItem('user');
            const params = new HttpParams({ fromString: 'name=term' });

            return this.session.getToken().subscribe({
                next: (data) => {
                    if (data.body !== true) {
                        this.session.logIn().subscribe({
                            next: (data) => {
                                if (data.body === true) {
                                    const currentPath = this.location.path();
                                    this.router.navigate([currentPath]);
                                }
                            },
                            error: (e) => {
                                this.session.SetUserCookie(null);
                                resolve(false);
                            }
                        })

                    }
                    else {
                        this.session.getUser().subscribe({
                            next: (data) => {

                                if (data.body.username === null) {
                                    this.session.SetUserCookie(null);
                                    resolve(false);
                                }
                                else {
                                    this.session.SetUserCookie(data.body);
                                    resolve(true);
                                }

                            },
                            error: (error) => {
                                this.session.SetUserCookie(null);
                                resolve(false);
                            }
                        });


                    }

                },
                error: (error) => {
                    this.session.SetUserCookie(null);
                    resolve(false);
                }
            });

        });
    }
}

