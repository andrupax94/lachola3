import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private sharedDataSubject = new BehaviorSubject<any>(null);
    sharedData$ = this.sharedDataSubject.asObservable();
    private sharedDataSubject2 = new BehaviorSubject<any>(null);
    sharedData2$ = this.sharedDataSubject.asObservable();
    order: 'asc' | 'desc' = 'asc';
    dateStart: Date = new Date('11/02/2023');
    dateEnd: Date = new Date('11/02/2023');
    fee: string = '0';
    orderBy: string = 'nombre';
    perPage: number = 5;
    compartirDatos(nuevosDatos: any) {
        this.sharedDataSubject.next(nuevosDatos);
    }
    compartirFiltros(nuevosDatos: any) {
        this.sharedDataSubject2.next(nuevosDatos);
    }
    constructor() {

    }
}
