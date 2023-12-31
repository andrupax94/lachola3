import { eventoP } from '../tiposDatos/eventosP';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactoryService } from 'src/factory/factory.module';
import { FilterService } from '../filter/filter.service';
import { filter } from 'rxjs';




@Component({
    selector: 'app-verEventos',
    templateUrl: './verEventos.component.html',
    styleUrls: ['./verEventos.component.css'],
    // encapsulation: ViewEncapsulation.None
})
export class VerEventosComponent {
    private apiUrl = 'assets/eventosP.json';
    public eventoP: eventoP[] = [];
    public page: number = 1;
    public orderBy: string = 'fechaLimite';
    public order: string = 'asc';
    public perPage: number = 5;
    public totalPages: number = 1;
    public compararFechas!: Function;
    public it = false;
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


    constructor(private http: HttpClient, private factory: FactoryService, private filter: FilterService) {
        this.compararFechas = factory.differenceInDays;

    }

    public abreUrl(urls: string[]) {

    }
    ngOnInit() {
        this.buscaEventosIt();
        this.filter.compartirDatos('verEventos');
        this.filter.sharedData2$.subscribe(nuevosDatos => {
            this.order = this.filter.order;
            this.dateStart = this.filter.dateStart;
            this.dateEnd = this.filter.dateEnd;
            this.fee = this.filter.fee;
            this.source = this.filter.source;
            this.orderBy = this.filter.orderBy;
            this.perPage = this.filter.perPage;
            this.buscaEventosIt();
        });
    }


    async buscaEventosIt() {
        this.it = true;
        while (this.it && this.contador < 2) {
            this.buscaEventos();
            await this.esperar(500);
        }
    }
    esperar(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    extraeEventos() {
        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('pages', 1);
        params = params.set('festivalPage', 'festhome');

        this.http.post<any>(environment.back + 'extractFestivalData', params, {}).subscribe({
            next: (data) => {
                if (data.status !== true) {
                    console.log(data.status);
                }
                else {
                    this.it = false;
                    this.totalPages = data.data.totalPages;
                    data.data.forEach((evt: any) => {
                        let aux: any = [];
                        aux.id = evt["id"];
                    });

                }
            },
            error: (error) => {
                this.it = false;
                console.log(error);
            }
        });
    }
    async buscaEventos() {
        this.contador++;

        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('page', this.page);
        params = params.set('orderby', this.orderBy);
        params = params.set('per_page', this.perPage); // Corregí this.orderBy por this.perPage
        params = params.set('dateStart', this.dateStart); // Corregí this.orderBy por this.perPage
        params = params.set('dateEnd', this.dateEnd); // Corregí this.orderBy por this.perPage
        params = params.set('fee', JSON.stringify(this.fee)); // Corregí this.orderBy por this.perPage
        params = params.set('source', JSON.stringify(this.source)); // Corregí this.orderBy por this.perPage
        params = params.set('order', this.order);
        this.http.post<any>(environment.back + 'getEventos', params, {}).subscribe({
            next: (data) => {

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
                    data.eventos.forEach((evt: any) => {
                        let aux: any = [];
                        aux.id = evt["id"];
                        aux.banner = evt["banner"];
                        aux.imagen = evt["imagen"];
                        aux.nombre = evt["nombre"];
                        aux.tasa = [[]];
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
                        aux.url = this.factory.stringToArray(evt["url"]);
                        aux.fuente = this.factory.stringToArray(evt["fuente"]);
                        aux.fechaLimite = [];
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
                        // aux.descripcion = evt["descripcion"];
                        // aux.fechaInicio=evt["fechaInicio"];
                        // aux.categoria=evt["categoria"];
                        // aux.telefono=evt["telefono"];
                        // aux.correoElectronico=evt["correoElectronico"];
                        // aux.web=evt["web"];
                        // aux.facebook=evt["facebook"];
                        // aux.instagram=evt["instagram"];
                        // aux.youtube=evt["youtube"];
                        // aux.industrias=evt["industrias"];
                        // aux.twitterX=evt["twitterX"];
                        this.eventoP.push(aux);

                    });
                }
            }, error: (error) => {
                this.it = false;
                this.contador = 0;
                console.log(error);
            }
        });


    }
}
