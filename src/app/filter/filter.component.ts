import { FilterService } from './filter.service';
import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FilterComponent {
    constructor(private filter: FilterService) {

    }
    public pageFilter = 'none';
    public bgColor = 'grey';
    cambiaPagina(e: MouseEvent, page: string = 'none') {
        let elem = e.currentTarget;
        this.filter.compartirDatos(page);
    }
    actualizaColor(nuevosDatos: string) {
        if (nuevosDatos === null) {
            this.filter.compartirDatos('none');
            this.bgColor = 'gray';
        }
        else {
            switch (nuevosDatos) {
                case 'verEventos':
                    this.bgColor = '#e20303';
                    break;
                case 'exEventos':
                    this.bgColor = '#3c61bc';
                    break;
                case 'verSubvenciones':
                    this.bgColor = '#cccccc';
                    break;
                case 'exSubvenciones':
                    this.bgColor = 'gray';
                    break;
            }
            this.pageFilter = nuevosDatos;
        }
    }
    ngOnInit() {
        this.filter.sharedData$.subscribe(nuevosDatos => {
            this.actualizaColor(nuevosDatos)
        });
    }
}
