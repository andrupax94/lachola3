import { eventoP } from '../tiposDatos/eventosP';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactoryService } from 'src/factory/factory.module';
import { FilterService } from '../filter/filter.service';
import { Observable, filter } from 'rxjs';




@Component({
    selector: 'app-verEventos',
    templateUrl: './verEventos.component.html',
    styleUrls: ['./verEventos.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class VerEventosComponent {
    private apiUrl = 'assets/eventosP.json';
    public eventoP: eventoP[] = [];
    public eventoAdd: eventoP[] = [];
    public page: number = 1;
    public orderBy: string = 'fechaLimite';
    public order: string = 'asc';
    public perPage: number = 5;
    public totalPages: number = 1;
    public startPage: number = 1;
    public endPage: number = 1;
    public visiblePages = [1];
    public compararFechas!: Function;
    public it = false;
    public onlyFilter: string = 'true';
    public contador = 0;
    public dateStart: any = '1/1/1999';
    public dateEnd: any = '1/1/2999';
    public fee = [true, true, true];

    public source: { [key: string]: boolean } = {
        'festhome': true,
        'movibeta': true,
        'animationfestivals': true,
        'filmfreeaway': true,
        'shortfilmdepot': true
    };
    public pageFilter: string = 'none';

    constructor(private http: HttpClient, private factory: FactoryService, private filter: FilterService) {
        this.compararFechas = factory.differenceInDays;
    }

    public abreUrl(url: string) {
        window.open(url, '_blank');
    }
    private agregarOEliminarElemento = this.factory.agregarOEliminarElemento;
    public agregarEventoEx(e: Event, index: number) {
        e.stopPropagation();
        this.eventoAdd = this.agregarOEliminarElemento(this.eventoP[index], this.eventoAdd) as eventoP[];

    }
    ngOnInit() {
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
                this.onlyFilter = this.filter.onlyFilter;
                switch (page.filter) {
                    case 'verEventos':
                        this.buscaEventosIt();
                        break;
                    case 'exEventos':
                        this.order = this.filter.order;
                        this.dateStart = this.filter.dateStart;
                        this.dateEnd = this.filter.dateEnd;
                        this.fee = this.filter.fee;
                        this.source = this.filter.source;
                        this.orderBy = this.filter.orderBy;
                        this.perPage = this.filter.perPage;
                        this.onlyFilter = this.filter.onlyFilter;
                        this.pageFilter = page.filter;
                        this.acciones(page.typeOp);
                        break;
                }
            }
        });

        this.filter.pageSD$.subscribe(page => {

            switch (page) {

                case 'verEventos':
                    this.buscaEventosIt();
                    break;
                case 'exEventos':
                    this.eventoP = [];
                    this.totalPages = 1;
                    this.page = 1;
                    break;
            }
        });

    }
    public acciones(accion: string) {
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
        switch (accion) {
            case 'verEventos':
                this.onlyFilter = 'true';
                this.buscaEventosIt();
                break;
            case 'Extraer':
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
    esperar(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async saveEventos(url: string) {
        this.contador++;
        let params = new HttpParams({ fromString: 'name=term' });

        params = params.set('eventos', JSON.stringify(this.eventoAdd)); // Corregí this.orderBy por this.perPage

        this.http.post<any>(environment.back + url, params, { observe: 'response', withCredentials: true }).subscribe({
            next: (data: any) => {
                this.it = false;
                this.contador = 0;
                console.log(data);


            }, error: (error) => {
                this.it = false;
                this.contador = 0;
                console.log(error);
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
    async buscaEventos(request: string = 'getEventos') {
        this.contador++;

        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('page', this.page);
        params = params.set('orderby', this.orderBy);
        params = params.set('per_page', this.perPage); // Corregí this.orderBy por this.perPage
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
                    console.log(data.status);
                    this.contador--;
                }
                else if (data.status === undefined) {
                    this.contador = 0;
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

                        aux.ubicacion = evt["ubicacion"];
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
                        aux.fechaLimite["fecha"] = evt["fechaLimite"];
                        aux.tipoFestival = (String)(evt["tipoFestival"]).toLowerCase();
                        aux.tipoMetraje = this.factory.stringToArray(evt["tipoMetraje"]);
                        aux.checked = false;
                        aux.id = ((this.page - 1) * (this.perPage)) + (index + 1);
                        let aux4: eventoP = {
                            imagen: aux.imagen,
                            nombre: aux.nombre,
                            tasa: aux.tasa,
                            categoria: aux.categoria,
                            ubicacion: aux.ubicacion,
                            url: aux.url,
                            fuente: aux.fuente,
                            fechaLimite: aux.fechaLimite,
                            tipoFestival: aux.tipoFestival,
                            tipoMetraje: aux.tipoMetraje,
                            check: aux.checked,
                            id: aux.id
                        }
                        this.eventoP.push(aux4);

                    });
                    this.getVisiblePages();
                    if (this.pageFilter === 'exEventos')
                        this.verificaCheckBoxes();
                }
            }, error: (error) => {
                this.it = false;
                this.contador = 0;
                console.log(error);
            }
        });


    }
    public getVisiblePages() {
        const totalPages = this.totalPages;
        const maxVisiblePages = 10;

        let startPage = 2;
        if (this.page > maxVisiblePages / 2) {
            startPage = Math.max(2, this.page - Math.floor(maxVisiblePages / 2));
        }

        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
        this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);
    }
    private verificaCheckBoxes() {
        this.eventoP.forEach((element: any) => {
            if (this.agregarOEliminarElemento(element, this.eventoAdd, true)) {
                element.check = true;
            }
        });
    }
}
