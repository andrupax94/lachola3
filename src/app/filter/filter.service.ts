import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private sharedDataSubject = new BehaviorSubject<any>(null);
    sharedData$ = this.sharedDataSubject.asObservable();

    compartirDatos(nuevosDatos: any) {
        this.sharedDataSubject.next(nuevosDatos);
    }
    constructor() {

    }
}
