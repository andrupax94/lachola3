import { HttpClient, HttpClientXsrfModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { SessionService } from '../factory/session.service';
import { CargaService } from 'src/factory/carga.service';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { FactoryService } from 'src/factory/factory.module';
import { authGuard } from '../guards/auth.guard';
import { FilterService } from './filter/filter.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'lachola';
    public currentPath = '';
    public user: any;
    public bgColor = 'grey';
    public filtroOpen = true;
    public filtroWidth: number | undefined = 0;

    public pageFilter: string = "none";
    constructor(
        private auth: authGuard,
        private session: SessionService,
        private carga: CargaService,
        private router: Router,
        private location: Location,
        private filter: FilterService) {
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
    abrirCerrarFiltro() {

        if (this.filtroOpen) {
            this.filtroWidth = $('#filtros_s_cont').width();
            $('#filtros_s_cont').css('left', '-' + this.filtroWidth + 'px');
            $('#filtros_s_cont').css('0px');

        }
        else {

            $('#filtros_s_cont').css('left', '0px');

        }
        this.filtroOpen = !this.filtroOpen;
    }
    actualizaColor(pagina: string) {
        if (pagina === null) {
            this.filter.compartirPagina('none');
            this.bgColor = 'gray';
        }
        else {
            switch (pagina) {
                case 'verEventos':
                    this.bgColor = '#e20303';
                    break;
                case 'exEventos':
                    this.bgColor = '#3c61bc';
                    break;
                case 'verSubvenciones':
                    this.bgColor = '#cccccc';
                    break;
                case 'exSubvenciones':
                    this.bgColor = 'gray';
                    break;
            }
            this.pageFilter = pagina;
        }
    }
    cambiaPagina(e: MouseEvent, page: string = 'none') {
        this.carga.to('body');
        this.carga.play();
        this.router.navigate(["verEventos"]);
        this.filter.compartirPagina(page);
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
        this.filter.pageSD$.subscribe(nuevosDatos => {
            this.actualizaColor(nuevosDatos);
        });

    }
}
