
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class SessionService {
    private userCookie = new BehaviorSubject<any>(null);
    SDuserCookie$ = this.userCookie.asObservable();
    constructor(private http: HttpClient, private router: Router) {

    }
    SetUserCookie(nuevosDatos: any) {
        localStorage.setItem('user', nuevosDatos);
        this.userCookie.next(nuevosDatos);
    }
    public getToken(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = 'http://lachola.test/api/getToken';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public getUser(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = 'http://lachola.test/api/getUser';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public logIn(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = 'http://lachola.test/api/logIn';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public user: any;



}
