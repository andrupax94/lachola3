
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private page = new BehaviorSubject<any>(null);
    pageSD$ = this.page.asObservable();
    private filtros = new BehaviorSubject<any>(null);
    filtrosSD$ = this.filtros.asObservable();


    order: 'asc' | 'desc' = 'asc';
    dateStart: string | null = this.datePipe.transform(new Date('11-02-1999'), 'yyyy-MM-dd');
    dateEnd: string | null = this.datePipe.transform(new Date('11-02-2999'), 'yyyy-MM-dd');
    fee: [boolean, boolean, boolean] = [true, true, true];
    onlyFilter: string = 'true';
    source: { [key: string]: boolean } = {
        'festhome': true,
        'movibeta': true,
        'animationfestivals': true,
        'filmfreeaway': true,
        'shortfilmdepot': true
    }; orderBy: string = 'fechaLimite';
    perPage: number = 5;
    finish: boolean = true;

    compartirPagina(pagina: any) {
        this.page.next(pagina);
    }
    compartirFiltros(filtros: any, typeOp: string) {
        let data = {
            filtros: filtros, typeOp: typeOp
        }
        this.filtros.next(data);
    }

    constructor(private datePipe: DatePipe) {

    }
}
