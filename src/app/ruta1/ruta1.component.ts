import { eventoP } from './../tiposDatos/eventosP';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FactoryService } from 'src/factory/factory.module';




@Component({
    selector: 'app-ruta1',
    templateUrl: './ruta1.component.html',
    styleUrls: ['./ruta1.component.css']
})
export class Ruta1Component {
    private apiUrl = 'assets/eventosP.json';
    public eventoP: eventoP[] = [];
    public page: number = 1;
    public orderby: string = 'fechaInicio';
    public per_page: number = 5;
    public order: string = 'asc';
    public totalPages: number = 1;

    public it=false;
    public contador=1;

    constructor(private http: HttpClient, private factory: FactoryService) {


    }

    public abreUrl(urls: string[]) {

    }
    ngOnInit() {
        this.buscaEventosIt();
    }


    async buscaEventosIt(){
        this.it=true;
        while(this.it){

            this.buscaEventos();
            this.contador++;
            await this.esperar(500);
        }
    }
    esperar(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    extraeEventos(){
        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('pages', 1);
        params = params.set('festivalPage', 'festhome');

        this.http.post<any>(environment.back + 'extractFestivalData', params, {}).subscribe((data) => {
            if(data.status!==true){
                console.log(data.status);
            }
            else{
            this.it=false;
            this.totalPages = data.data.totalPages;
            data.data.forEach((evt: any) => {
                let aux: any = [];
                aux.id = evt["id"];
            });

        }
        }, (error) => {
            this.it=false;
            console.log(error);
        });
    }
    async buscaEventos() {
        let params = new HttpParams({ fromString: 'name=term' });
        params = params.set('page', this.page);
        params = params.set('orderby', this.orderby);
        params = params.set('per_page', this.per_page); // Corregí this.orderby por this.per_page
        params = params.set('order', this.order);
        this.http.post<any>(environment.back + 'getEventos',params,{}).subscribe((data)=>{
            this.totalPages=data.totalPages
           data.eventos.forEach((evt:any) =>{
                let aux:any=[];
                aux.id=evt["id"];
                aux.banner=evt["banner"];
                aux.imagen=evt["imagen"];
                aux.nombre=evt["nombre"];
                aux.descripcion=evt["descripcion"];
                aux.tasa=evt["tasa"];
                aux.ubicacion=evt["ubicacion"];
                aux.url=this.factory.stringToArray(evt["url"]);
                aux.fuente=evt["fuente"];
                aux.fechaLimite=evt["fechaLimite"];
                // aux.fechaInicio=evt["fechaInicio"];
                // aux.categoria=evt["categoria"];
                // aux.tipo_metraje=evt["tipo_metraje"];
                // aux.tipo_festival=evt["tipo_festival"];
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
        });


    }
}
