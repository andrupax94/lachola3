import { eventoP } from './../tiposDatos/eventosP';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-ruta1',
    templateUrl: './ruta1.component.html',
    styleUrls: ['./ruta1.component.css']
})
export class Ruta1Component {
    private apiUrl = '/assets/eventosP.json';
    public eventoP:eventoP[]=[];
    constructor(private http: HttpClient) { }

    ngOnInit() {

       this.http.get<any>(environment.apiUrl+this.apiUrl).subscribe((data)=>{
            data.forEach((evento:eventoP) => {
                this.eventoP.push(evento);
            });

       });

    }

}
