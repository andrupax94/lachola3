import { eventoP } from './../tiposDatos/eventosP';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ruta1',
    templateUrl: './ruta1.component.html',
    styleUrls: ['./ruta1.component.css']
})
export class Ruta1Component {
    private apiUrl = 'assets/eventosP.json';
    public eventoP:eventoP[]=[];
    constructor(private http: HttpClient) { }
    ngOnInit() {
        const params = new HttpParams({fromString: 'name=term'});
        this.http.post<any>(environment.back + 'getEventos',params,{}).subscribe((data)=>{
           data.forEach((evt:any) =>{
                let aux:any=[];
                aux.id=evt["id"];
                aux.imagen=evt["imagen"];
                aux.nombre=evt["nombre"];
                aux.descripcion=evt["descripcion"];
                aux.tasa=evt["tasa"];
                aux.categoria=evt["categoria"];
                aux.tipo_metraje=evt["tipo_metraje"];
                aux.tipo_festival=evt["tipo_festival"];
                aux.fechaInicio=evt["fechaInicio"];
                aux.fechaLimite=evt["fechaLimite"];
                aux.banner=evt["banner"];
                aux.telefono=evt["telefono"];
                aux.correoElectronico=evt["correoElectronico"];
                aux.fuente=evt["fuente"];
                aux.url=evt["url"];
                aux.web=evt["web"];
                aux.facebook=evt["facebook"];
                aux.ubicacion=evt["ubicacion"];
                aux.instagram=evt["instagram"];
                aux.youtube=evt["youtube"];
                aux.industrias=evt["industrias"];
                aux.twitterX=evt["twitterX"];
                this.eventoP.push(aux);
           });
        });
    }

}
