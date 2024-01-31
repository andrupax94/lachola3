import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class procesing implements CanActivate {
    constructor(private http: HttpClient) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return new Promise<boolean | UrlTree>((resolve, reject) => {
            this.http.post<any>(environment.back + 'procesingDelete', {}).subscribe({
                next: (data) => {
                    resolve(true);
                },
                error: (e) => {
                    resolve(true);
                }
            });

        });
    }
}

