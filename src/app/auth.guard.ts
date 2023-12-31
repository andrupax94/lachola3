import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
  })
export class authGuard implements CanActivate{
    constructor(private router:Router,private http:HttpClient){

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        localStorage.setItem('user','fgdgf')
        // localStorage.removeItem('user');
        // Aquí, verifica la existencia de tu variable de sesión o cualquier otra lógica de autenticación.
        const isLoggedIn = localStorage.getItem('user');

        if (isLoggedIn) {
            const params = new HttpParams({fromString: 'name=term'});
            this.http.post<any>(environment.back + 'dameSesion',params,{}).subscribe((data)=>{
                if(data.mensaje==='No Login'){
                    // localStorage.removeItem('user');
                }
                else if(data.mensaje==='OK'){
                    // localStorage.setItem('user',data.user);
                }
            });

            const currentUrl = window.location.hash;
            if (currentUrl.indexOf('/logIn')!==-1) {
                window.location.hash='#';
                this.router.navigate(['/']);
            }
            return true;
        } else {
            const currentUrl = window.location.hash;
            if (currentUrl.indexOf('/logIn')!==-1) {

                return true;
            }
            else{
                window.location.hash='#/logIn';
                this.router.navigate(['/logIn']);
                return false;
            }

        }
    }

}

