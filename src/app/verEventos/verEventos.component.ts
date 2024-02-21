import { eventoP } from '../../tiposDatos/eventosP';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactoryService } from 'src/factory/factory.module';
import { FilterService } from '../filter/filter.service';
import { Observable, filter } from 'rxjs';
import { CargaService } from 'src/factory/carga.service';
import { ChangeColorService } from 'src/factory/change-color.service';
import { MensajesService } from 'src/factory/mensajes.service';




@Component({
    selector: 'app-verEventos',
    templateUrl: './verEventos.component.html',
    styleUrls: ['./verEventos.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class VerEventosComponent {
    constructor(private http: HttpClient,
        private colorService: ChangeColorService,
        private factory: FactoryService,
        private filter: FilterService,
        private mensaje: MensajesService,
        private carga: CargaService) {
        this.compararFechas = factory.differenceInDays;
    }
    public eventoP: eventoP[] = [];
    public eventoAdd: eventoP[] = [];
    public countries: any[] = [];
    public page: number = 1;
    public orderBy: string = 'fechaLimite';
    public order: string = 'asc';
    public perPage: number = 5;
    public finish: boolean = false;
    public totalPages: number = 1;
    public startPage: number = 1;
    public endPage: number = 1;
    public visiblePages = [1];
    public compararFechas!: Function;
    private it = false;
    public bgColor = 'grey';
    public onlyFilter: string = 'true';
    public contador = 0;
    public dateStart: any = '1/1/1999';
    public dateEnd: any = '1/1/2999';
    public fee = [true, true, true];
    public pageFilter: string = 'none';
    private agregarOEliminarElemento = this.factory.agregarOEliminarElemento;
    public source: { [key: string]: boolean } = {
        'festhome': true,
        'movibeta': true,
        'animationfestivals': true,
        'filmfreeaway': true,
        'shortfilmdepot': true
    };


    private getCountries() {
        this.http.get<any>('assets/flags/countries.json').subscribe({
            next: (data) => {
                this.countries = data;
            },
            error: (error) => {

                console.log('error Al Obtener Las Countries');

            }
        });
    }
    public abreUrl(url: string) {
        window.open(url, '_blank');
    }

    public agregarEventoEx(e: Event, index: number) {
        e.stopPropagation();
        let aux = this.eventoP;
        this.eventoAdd = this.agregarOEliminarElemento(aux[index], this.eventoAdd) as eventoP[];
    }
    ngOnInit() {
        this.getCountries();
        this.carga.changeInfo(undefined, 'Cargando Eventos');
        this.filter.compartirPagina('verEventos');
        this.filter.filtrosSD$.subscribe(page => {
            //PATCH se dispara este evento pero no se porque por eso le pongo la condicion de null
            if (page !== null) {
                this.order = this.filter.order;
                this.dateStart = this.filter.dateStart;
                this.dateEnd = this.filter.dateEnd;
                this.fee = this.filter.fee;
                this.source = this.filter.source;
                this.orderBy = this.filter.orderBy;
                this.perPage = this.filter.perPage;
                this.finish = this.filter.finish;
                this.onlyFilter = this.filter.onlyFilter;
                switch (page.filtros) {
                    case 'verEventos':
                        this.accionesVer(page.typeOp);
                        break;
                    case 'exEventos':
                        this.accionesExtraer(page.typeOp);
                        break;
                }
            }
        });

        this.filter.pageSD$.subscribe(page => {
            this.bgColor = this.colorService.actualizaColor(page);
            this.pageFilter = page;
            this.eventoP = [];
            this.eventoAdd = [];
            this.totalPages = 1;
            this.visiblePages = [1];
            this.page = 1;
            switch (page) {
                case 'verEventos':
                    this.carga.to('body');
                    this.carga.play();
                    this.buscaEventosIt();
                    break;
                case 'exEventos':
                    this.carga.pause();
                    break;
            }
        });

    }
    public accionesVer(accion: string) {
        switch (accion) {
            case 'Ver':
                this.onlyFilter = 'true';
                this.buscaEventosIt();
                break;
            case 'ForzarVer':
                this.onlyFilter = 'false';
                this.buscaEventosIt();
                break;
            case 'Eliminar':
                this.delEventosIt();
                break;

        }
    }
    public accionesExtraer(accion: string) {
        switch (accion) {
            case 'Extraer':
                this.onlyFilter = 'true';
                this.exEventosIt();
                break;
            case 'Forzar':
                this.onlyFilter = 'false';
                this.exEventosIt();
                break;
            case 'Guardar':
                this.saveEventosIt();
                break;
            case 'GuardarTodo':
                this.saveEventosAllIt();
                break;
        }
    }
    public accionesPage(accion: string) {
        this.carga.to('body');
        this.carga.play();
        switch (accion) {
            case 'verEventos':
                this.onlyFilter = 'true';
                this.buscaEventosIt();
                break;
            case 'exEventos':
                this.onlyFilter = 'true';
                this.exEventosIt();
                break;

        }
    }
    async buscaEventosIt() {
        this.it = true;
        while (this.it && this.contador < 2) {
            this.buscaEventos();
            await this.esperar(1000);
        }
    }
    async exEventosIt() {
        this.it = true;
        if (!(this.it && this.contador < 2)) {
            this.carga.pause();
        }
        while (this.it && this.contador < 2) {
            this.buscaEventos('extractFestivalDataGroup');
            await this.esperar(1000);
        }
    }
    async saveEventosIt() {
        this.it = true;
        while (this.it && this.contador < 2) {
            this.saveEventos('saveEvents');
            await this.esperar(1000);
        }
    }
    async saveEventosAllIt() {
        this.it = true;
        while (this.it && this.contador < 2) {
            this.saveEventos('saveEventsAll');
            await this.esperar(1000);
        }
    }
    async delEventosIt() {
        this.it = true;
        while (this.it && this.contador < 2) {
            this.delEventos('delEvents');
            await this.esperar(1000);
        }
    }
    esperar(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    async buscaEventos(request: string = 'getEventos') {
        this.contador++;

        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('page', this.page);
        params = params.set('orderby', this.orderBy);
        params = params.set('per_page', this.perPage); // Corregí this.orderBy por this.perPage
        params = params.set('finish', this.finish); // Corregí this.orderBy por this.perPage
        params = params.set('dateStart', this.dateStart); // Corregí this.orderBy por this.perPage
        params = params.set('dateEnd', this.dateEnd); // Corregí this.orderBy por this.perPage
        params = params.set('fee', JSON.stringify(this.fee)); // Corregí this.orderBy por this.perPage

        params = params.set('source', JSON.stringify(this.filtrarPorValorVerdadero(this.source)));
        // Corregí this.orderBy por this.perPage
        params = params.set('order', this.order);
        if (this.onlyFilter === 'true')
            params = params.set('onlyFilter', 'true');
        this.http.post<any>(environment.back + request, params, { observe: 'response', withCredentials: true }).subscribe({
            next: (data: any) => {
                data = data.body;
                if (data.status !== true && data.status !== undefined) {
                    this.carga.changeInfo(undefined, data.status)
                    console.log(data.status);
                    this.contador--;
                }
                else if (data.status === undefined) {
                    this.contador = 0;
                    this.carga.pause();
                    this.it = false;
                }
                else {
                    this.eventoP = [];
                    this.contador = 0;
                    this.it = false;
                    this.totalPages = data.totalPages;
                    data.eventos.forEach((evt: any, index: number) => {
                        let aux: any = [];

                        aux.banner = evt["banner"];
                        aux.imagen = evt["imagen"];
                        aux.nombre = evt["nombre"];
                        aux.categoria = (evt["categoria"] === undefined) ? ['No Especificado'] : this.factory.stringToArray(evt["categoria"]);
                        aux.tasa = {};
                        if (evt["tasa"]["text"] !== undefined) {
                            aux.tasa.text = evt["tasa"]['text'];
                            if (aux.tasa.text === 'Tiene Tasas')
                                aux.tasa.bool = 2;
                            else
                                aux.tasa.bool = parseInt(evt["tasa"]['bool']);
                        } else {
                            if (typeof evt["tasa"] === 'number') {
                                evt["tasa"] = evt["tasa"].toString();
                            }
                            let tasaA = this.factory.stringToArray(evt["tasa"]).length;
                            aux.tasa.text = this.factory.arrayToString(evt["tasa"]);
                            if (tasaA > 1)
                                aux.tasa.bool = 2;
                            else {
                                if (aux.tasa.text.indexOf('FREE') !== -1 || aux.tasa.text.indexOf('free') !== -1 || aux.tasa.text === '0') {
                                    aux.tasa.bool = 1;
                                }
                                else {
                                    aux.tasa.bool = 0;
                                }
                            }
                        }
                        aux.ubicacion = evt["ubicacion"];
                        aux.ubicacionFlag = this.factory.buscarPais(evt["ubicacion"], this.countries);
                        aux.url = evt["url"];
                        aux.fuente = this.factory.stringToArray(evt["fuente"]);
                        aux.fechaLimite = {};
                        let aux2 = this.factory.stringToArray(evt["fechaLimite"]);
                        let aux3 = typeof (aux2);
                        if (aux3 === 'string')
                            aux.fechaLimite["varias"] = false;
                        else if (aux3 === 'object') {
                            aux.fechaLimite["varias"] = true;
                        }
                        aux.fechaLimite["fecha"] = this.factory.convertirFormatoFecha(evt["fechaLimite"]);
                        aux.tipoFestival = (String)(evt["tipoFestival"]).toLowerCase();
                        aux.tipoMetraje = this.factory.stringToArray(evt["tipoMetraje"]);
                        aux.checked = false;
                        aux.id = ((this.page - 1) * (this.perPage)) + (index + 1);
                        aux.idWp = evt["id"];
                        let aux4: eventoP = {
                            imagen: aux.imagen,
                            nombre: aux.nombre,
                            tasa: aux.tasa,
                            categoria: aux.categoria,
                            ubicacion: aux.ubicacion,
                            ubicacionFlag: aux.ubicacionFlag,
                            url: aux.url,
                            fuente: aux.fuente,
                            fechaLimite: aux.fechaLimite,
                            tipoFestival: aux.tipoFestival,
                            tipoMetraje: aux.tipoMetraje,
                            check: aux.checked,
                            id: aux.id,
                            idWp: aux.idWp
                        }
                        this.eventoP.push(aux4);

                    });
                    this.carga.pause();
                    this.getVisiblePages();
                    if (this.pageFilter === 'exEventos')
                        this.verificaCheckBoxes();
                }
            }, error: (error) => {
                this.it = false;
                this.contador = 0;
                this.carga.pause();
                console.log(error);
            }
        });


    }
    async saveEventos(url: string) {
        this.eventoAdd.forEach((element, key) => {
            let aux = this.eventoAdd[key].ubicacion;

            let aux2 = '(' + this.factory.buscarPais(aux, this.countries, false) + ')';
            if (aux.indexOf(aux2) === -1) {
                aux = aux2 + aux;
                this.eventoAdd[key].ubicacion = aux;
            }

        });
        this.contador++;
        let params = new HttpParams({ fromString: 'name=term' });

        params = params.set('eventos', JSON.stringify(this.eventoAdd)); // Corregí this.orderBy por this.perPage

        this.http.post<any>(environment.back + url, params, { observe: 'response', withCredentials: true }).subscribe({
            next: (data: any) => {
                data = data.body;
                if (data.status !== true && data.status !== undefined) {
                    this.carga.changeInfo(undefined, data.status)
                    this.contador--;
                }
                else if (data.status === undefined) {
                    this.contador = 0;
                    this.carga.pause();
                    this.it = false;
                }
                else {

                    this.carga.pause();
                    if (this.it) {
                        this.mensaje.add('ok', 'Se Añadieron Los Eventos Correctamente');
                    }
                    this.contador = 0;
                    this.it = false;
                }


            }, error: (error) => {
                this.it = false;
                this.carga.pause();
                this.contador = 0;
                console.log(error);
            }
        });

    }
    async delEventos(url: string) {

        this.contador++;
        let params = new HttpParams({ fromString: 'name=term' });

        params = params.set('eventos', JSON.stringify(this.eventoAdd)); // Corregí this.orderBy por this.perPage

        this.http.post<any>(environment.back + url, params, { observe: 'response', withCredentials: true }).subscribe({
            next: (data: any) => {
                data = data.body;
                if (data.status !== true && data.status !== undefined) {
                    this.carga.changeInfo(undefined, data.status)
                    this.contador--;
                }
                else if (data.status === undefined) {
                    this.contador = 0;
                    this.carga.pause();
                    this.it = false;
                }
                else {
                    this.eventoP = [];
                    this.eventoAdd = [];
                    this.carga.pause();
                    if (this.it) {
                        setTimeout(() => {
                            this.carga.to('body');
                            this.carga.play();
                            this.onlyFilter = 'false';
                            this.buscaEventosIt();
                        }, 500);
                        this.mensaje.add('ok', 'Se Eliminaron Los Eventos Correctamente');
                    }
                    console.log(data);
                    this.contador = 0;
                    this.it = false;

                }


            }, error: (error) => {
                this.it = false;
                this.carga.pause();
                this.contador = 0;
                console.log(error);
            }
        });

    }
    public getVisiblePages() {
        const totalPages = this.totalPages;
        const maxVisiblePages = 10;

        this.startPage = 1;
        if (this.page > maxVisiblePages - 1) {
            this.startPage = Math.max(2, this.page - Math.floor(maxVisiblePages / 2));
        }

        const endPage = Math.min(this.startPage + maxVisiblePages - 1, totalPages - 1);

        this.visiblePages = Array.from({ length: endPage - this.startPage + 1 }, (_, i) => i + this.startPage);
    }
    private verificaCheckBoxes() {
        this.eventoP.forEach((element: any) => {
            if (this.agregarOEliminarElemento(element, this.eventoAdd, true)) {
                element.check = true;
            }
        });
    }
    private filtrarPorValorVerdadero(objeto: { [key: string]: boolean }): string[] {
        // Obtiene pares clave-valor del objeto
        const pares = Object.entries(objeto);

        // Filtra aquellos cuyo valor booleano sea true
        const resultado = pares
            .filter(([clave, valor]) => valor === true)
            .map(([clave]) => clave);

        return resultado;
    }
}
