
import { Injectable } from '@angular/core';
import { User } from '../class/user';
import { Car } from '../class/car';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class SessionService {

    public user: User;
    public car: Car;
    private clear() {
        sessionStorage.clear();
        this.user = new User();
        this.car = new Car();
    }
    public async logIn(data: Object): Promise<boolean | string> {
        return new Promise<boolean | string>((resolve, reject) => {
            this.http.post<any>(this.url + 'logIn', data)
                .subscribe({
                    next: response => {
                        if (typeof response !== "string") {
                            sessionStorage.clear();
                            this.user = response;
                            sessionStorage.setItem('user', JSON.stringify(response));
                            sessionStorage.setItem('car', JSON.stringify(new Car()));
                            resolve(true);
                        } else {
                            resolve(response);
                        }
                    },
                    error: error => {
                        reject(false);
                    }
                });
        });
    }
    public async logOut(): Promise<boolean | string> {
        return new Promise<boolean | string>((resolve, reject) => {
            this.http.post<any>(this.url + 'logOut', {})
                .subscribe({
                    next: response => {
                        if (response === "cierre de sesion") {

                            resolve(true);

                        } else {


                            resolve(response);

                        }
                        this.clear();
                        window.location.reload()
                    },
                    error: error => {
                        reject(false);
                    }
                });
        });
    }
    url: string;
    constructor(private http: HttpClient, private router: Router) {
        try {
            this.user = (sessionStorage.getItem('user') !== null) ? JSON.parse(sessionStorage.getItem('user')!) : new User;
            this.car = (sessionStorage.getItem('car') !== null) ? JSON.parse(sessionStorage.getItem('car')!) : new Car;
        }
        catch (ex) {
            this.user = new User();
            this.car = new Car();
            sessionStorage.clear();
            this.router.navigate(['/home']);

        }
        this.url = environment.url;
        if (this.user.id_user === null) {
            this.http.post<any>(environment!.url + "giveMeSession", {
            })
                .subscribe({
                    next: response => {
                        if (response !== "Sin variables de sesion") {
                            this.user = new User(response.user);
                            this.car = new Car(response.car);
                        }
                        sessionStorage.setItem('user', JSON.stringify(this.user));
                        sessionStorage.setItem('car', JSON.stringify(this.car));
                    },
                    error: error => {
                        console.log(error);
                    }
                });
        }
    }
}
