import { FilterService } from './filter.service';
import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { CheckboxControlValueAccessor, CheckboxRequiredValidator, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FilterComponent {
    constructor(private filter: FilterService, private formBuilder: FormBuilder) {
        this.verEventos = this.formBuilder.group({
            order: String,
            dateStart: Date,
            dateEnd: Date,
            fee: Array,
            source: Array,
            orderBy: String,
            perPage: Number,
        });
        this.exEventos = this.formBuilder.group({});
        this.verSubvenciones = this.formBuilder.group({});
        this.exSubvenciones = this.formBuilder.group({});
        this.feeCheck[0] = true;
        this.feeCheck[1] = true;
        this.feeCheck[2] = true;
        this.fuenteCheck['festhome'] = true;
        this.fuenteCheck['movibeta'] = true;
        this.fuenteCheck['animationfestivals'] = true;
        this.fuenteCheck['filmfreeaway'] = true;
        this.fuenteCheck['shortfilmdepot'] = true;

        this.fuenteImgs[0] = '';
        this.fuenteImgs[1] = '';
        this.fuenteImgs[2] = '';
        this.fuenteImgs[3] = '';
        this.fuenteImgs[4] = '';

    }
    public verEventos: FormGroup;
    public exEventos: FormGroup;
    public verSubvenciones: FormGroup;
    public exSubvenciones: FormGroup;
    public pageFilter = 'none';
    public bgColor = 'grey';
    public fuenteCheck: { [key: string]: boolean } = {};
    public feeCheck: [boolean, boolean, boolean] = [true, true, true];

    public filtroOpen = true;
    public filtroHeight: number | undefined = 0;

    public fuenteImgs: { [key: number]: string } = [];
    private aplicarCambiosFiltros(onlyFilter = 'false') {
        this.filter.order = this.verEventos.get('order')?.value;
        this.filter.dateStart = this.verEventos.get('dateStart')?.value;
        this.filter.dateEnd = this.verEventos.get('dateEnd')?.value;
        this.filter.orderBy = this.verEventos.get('orderBy')?.value;
        this.filter.perPage = this.verEventos.get('perPage')?.value;
        this.filter.onlyFilter = onlyFilter;
        this.filter.fee = this.feeCheck;
        this.filter.source = this.fuenteCheck;
    }
    public verEventosSubmit(onlyFilter = 'false') {
        this.aplicarCambiosFiltros(onlyFilter);
        this.filter.compartirFiltros(this.pageFilter);
    }
    public accionarExEventos(accion: string) {
        this.aplicarCambiosFiltros();
        this.filter.exEventos(accion);
    }
    public verSubvencionesSubmit() { }
    public exSubvencionesSubmit() { }


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
    abrirCerrarFiltro() {

        if (this.filtroOpen) {
            this.filtroHeight = $('#filtros').height();
            $('#filtros').height(this.filtroHeight + 'px');
            $('#filtros').height('0px');
        }
        else {
            $('#filtros').height(this.filtroHeight + 'px');
            setTimeout(() => {
                $('#filtros').height('auto');
            }, 200);
        }
        this.filtroOpen = !this.filtroOpen;
    }
    ngOnInit() {
        this.filter.sharedData$.subscribe(nuevosDatos => {
            this.actualizaColor(nuevosDatos)
            this.verEventos.get('order')?.setValue(this.filter.order);
            this.verEventos.get('dateEnd')?.setValue(this.filter.dateEnd);
            this.verEventos.get('dateStart')?.setValue(this.filter.dateStart);
            this.verEventos.get('fee')?.setValue(this.filter.fee);
            this.verEventos.get('source')?.setValue(this.filter.source);
            this.verEventos.get('orderBy')?.setValue(this.filter.orderBy);
            this.verEventos.get('perPage')?.setValue(this.filter.perPage);
        });
    }
}
