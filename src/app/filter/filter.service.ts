
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private sharedDataSubject = new BehaviorSubject<any>(null);
    sharedData$ = this.sharedDataSubject.asObservable();
    private sharedDataSubject2 = new BehaviorSubject<any>(null);
    sharedData2$ = this.sharedDataSubject2.asObservable();
    order: 'asc' | 'desc' = 'asc';
    dateStart: string | null = this.datePipe.transform(new Date('11-02-1999'), 'yyyy-MM-dd');
    dateEnd: string | null = this.datePipe.transform(new Date('11-02-2999'), 'yyyy-MM-dd');
    fee: [boolean, boolean, boolean] = [true, true, true];
    source: string[] = ['festhome', 'movibeta', 'animationfestivals', 'filmfreeaway', 'shortfilmdepot'];
    orderBy: string = 'fechaLimite';
    perPage: number = 5;
    compartirDatos(nuevosDatos: any) {
        this.sharedDataSubject.next(nuevosDatos);
    }
    compartirFiltros(nuevosDatos: any) {
        this.sharedDataSubject2.next(nuevosDatos);
    }
    constructor(private datePipe: DatePipe) {

    }
}
