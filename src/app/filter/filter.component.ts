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
    ngOnInit() {
        this.filter.sharedData$.subscribe(nuevosDatos => {
            if (nuevosDatos === null)
                this.pageFilter = 'none';
            else
                this.pageFilter = nuevosDatos;
        });
    }
}
