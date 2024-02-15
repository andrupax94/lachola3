import { FilterService } from './filter.service';
import { Component, Renderer2 } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CargaService } from 'src/factory/carga.service';
import { ChangeColorService } from 'src/factory/change-color.service';
import { ModalesService } from 'src/factory/modales.service';
@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css'],
    // encapsulation: ViewEncapsulation.None
})
export class FilterComponent {
    public eventosForm: FormGroup;
    public subvencionesFrom: FormGroup;

    public pageFilter: string;
    public bgColor = 'grey';
    public fuenteCheck: { [key: string]: boolean } = {};
    public feeCheck: [boolean, boolean, boolean] = [true, true, true];
    public fuenteImgs: { [key: number]: string } = [];
    public valoresRadios: number[] = [5, 8, 11, 14, 17, 20, 23];
    // INFO CONSTRUCTOR
    constructor(private filter: FilterService,
        private colorService: ChangeColorService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder, private carga: CargaService, private modales: ModalesService) {
        this.eventosForm = this.formBuilder.group({
            order: String,
            dateStart: Date,
            dateEnd: Date,
            fee: Array,
            source: Array,
            orderBy: String,
            perPage: Number,
            finish: Boolean
        });
        this.pageFilter = 'verEventos';
        this.subvencionesFrom = this.formBuilder.group({});


        this.fuenteCheck['festhome'] = true;
        this.fuenteCheck['movibeta'] = true;
        this.fuenteCheck['animationfestivals'] = true;
        this.fuenteCheck['filmfreeaway'] = true;
        this.fuenteCheck['shortfilmdepot'] = true;

    }

    private aplicarCambiosFiltros(onlyFilter = 'false') {
        this.filter.order = this.eventosForm.get('order')?.value;
        this.filter.dateStart = this.eventosForm.get('dateStart')?.value;
        this.filter.dateEnd = this.eventosForm.get('dateEnd')?.value;
        this.filter.orderBy = this.eventosForm.get('orderBy')?.value;
        this.filter.perPage = this.eventosForm.get('perPage')?.value;
        this.filter.finish = this.eventosForm.get('finish')?.value;
        if (onlyFilter !== 'false')
            onlyFilter = 'true';
        this.filter.onlyFilter = onlyFilter;
        this.filter.fee = this.feeCheck;
        this.filter.source = this.fuenteCheck;
    }

    public eventosSubmit(mensaje = 'false', typeOp: string = 'none') {
        let callback = () => {
            this.carga.to('body');
            this.carga.play();
            this.aplicarCambiosFiltros(mensaje);
            this.filter.compartirFiltros(this.pageFilter, typeOp);
        }
        if (mensaje !== 'false') {
            this.modales.abrirPregunta('Forzar?', mensaje, callback, () => { });
        }
        else {
            callback();
        }


    }


    public verSubvencionesSubmit() { }
    public exSubvencionesSubmit() { }


    cambiaPagina(e: MouseEvent, page: string = 'none') {
        this.filter.compartirPagina(page);
    }



    ngOnInit() {
        this.filter.pageSD$.subscribe(nuevosDatos => {
            this.bgColor = this.colorService.actualizaColor(nuevosDatos);
            if (nuevosDatos === null) {
                this.filter.compartirPagina('none');
            }
            this.pageFilter = nuevosDatos;
            this.eventosForm.get('order')?.setValue(this.filter.order);
            this.eventosForm.get('dateEnd')?.setValue(this.filter.dateEnd);
            this.eventosForm.get('dateStart')?.setValue(this.filter.dateStart);
            this.eventosForm.get('fee')?.setValue(this.filter.fee);
            this.eventosForm.get('source')?.setValue(this.filter.source);
            this.eventosForm.get('orderBy')?.setValue(this.filter.orderBy);
            this.eventosForm.get('perPage')?.setValue(this.filter.perPage);
            this.eventosForm.get('finish')?.setValue(this.filter.finish);
        });

    }
}
