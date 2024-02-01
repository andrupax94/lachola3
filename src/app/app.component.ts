import { HttpClient, HttpClientXsrfModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { SessionService } from '../factory/session.service';
import { CargaService } from 'src/factory/carga.service';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { FactoryService } from 'src/factory/factory.module';
import { authGuard } from '../guards/auth.guard';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    // encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'lachola';
    public currentPath = '';
    public user: any;
    constructor(private auth: authGuard, private session: SessionService, private carga: CargaService, private router: Router, private location: Location) {
        this.user = { state: false, data: [], mensaje: '' };
        this.carga.to('body');
        this.currentPath = this.router.url;
        this.carga.play();
    }
    reload() {
        this.auth.reload();
    }
    shouldShowFilter: boolean = false;

    logOut() {
        this.carga.to('body');
        this.carga.changeInfo(undefined, 'Cerrando Sesion');
        this.carga.play();
        this.session.logOut();
        setTimeout(() => {
            this.router.navigate(['logIn']);
        }, 500);
    }
    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentPath = this.router.url;
            }
        });
        this.session.SDuserCookie$.subscribe((data) => {
            if (data !== null) {
                setTimeout(() => {
                    this.user = JSON.parse(localStorage.getItem('user')!);
                }, 500);
            }
        })

    }
}
