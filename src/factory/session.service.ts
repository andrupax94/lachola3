
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
        this.user = { state: false, data: [], mensaje: '' };
    }
    SetUserCookie(nuevosDatos: any) {
        localStorage.setItem('user', JSON.stringify(nuevosDatos));
        this.userCookie.next(nuevosDatos);
    }
    public getToken(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = environment.back + 'getToken';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public getUser(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = environment.back + 'getUser';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public logOut(): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        const url = environment.back + 'logOut';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public logIn(username: string, password: string): Observable<any> {

        let params = new HttpParams({ fromString: 'name=term' });
        params = params.append('username', username);
        params = params.append('password', password);
        const url = environment.back + 'logIn';
        // Realiza la solicitud POST y obtiene la respuesta completa
        return this.http.post(url, params, { observe: 'response', withCredentials: true });
    }
    public user: { state: boolean, data: [], mensaje: string };



}
