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
                aux.banner=evt["banner"];
           });

        });
    }

}
