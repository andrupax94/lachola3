import { Component } from '@angular/core';
import { CargaService } from 'src/factory/carga.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {
    constructor(
        private carga: CargaService
    ) { }
    ngOnInit() {
        this.carga.pause();
    }
}
