import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChangeColorService {
    public bgColor: string;
    constructor() {
        this.bgColor = 'gray';
    }
    actualizaColor(pagina: string) {
        if (pagina === null) {
            this.bgColor = 'gray';
        }
        else {
            switch (pagina) {
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

        }
        return this.bgColor;
    }
}
