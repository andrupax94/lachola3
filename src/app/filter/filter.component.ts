import { FilterService } from './filter.service';
import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CargaService } from 'src/factory/carga.service';
import { ModalesService } from 'src/factory/modales.service';
@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FilterComponent {
    public eventosForm: FormGroup;
    public subvencionesFrom: FormGroup;

    public pageFilter: string;
    public bgColor = 'grey';
    public fuenteCheck: { [key: string]: boolean } = {};
    public feeCheck: [boolean, boolean, boolean] = [true, true, true];
    public filtroOpen = true;
    public filtroHeight: number | undefined = 0;
    public fuenteImgs: { [key: number]: string } = [];

    // INFO CONSTRUCTOR
    constructor(private filter: FilterService, private formBuilder: FormBuilder, private carga: CargaService, private modales: ModalesService) {
        this.eventosForm = this.formBuilder.group({
            order: String,
            dateStart: Date,
            dateEnd: Date,
            fee: Array,
            source: Array,
            orderBy: String,
            perPage: Number,
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
        this.filter.onlyFilter = onlyFilter;
        this.filter.fee = this.feeCheck;
        this.filter.source = this.fuenteCheck;
    }

    public eventosSubmit(onlyFilter = 'false', typeOp: string = 'none') {
        let callback = () => {
            this.carga.to('body');
            this.carga.play();
            this.aplicarCambiosFiltros(onlyFilter);
            this.filter.compartirFiltros(this.pageFilter, typeOp);
        }
        if (onlyFilter === 'false') {
            this.modales.abrirPregunta('Forzar Busqueda', 'Desea forzar la busqueda de eventos, hacer uso de esta de manera desmedida puede generar problemas del lado del servidor, desea continuar?', callback, () => { });
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
    actualizaColor(pagina: string) {
        if (pagina === null) {
            this.filter.compartirPagina('none');
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
            this.pageFilter = pagina;
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
        this.filter.pageSD$.subscribe(nuevosDatos => {
            this.actualizaColor(nuevosDatos)
            this.eventosForm.get('order')?.setValue(this.filter.order);
            this.eventosForm.get('dateEnd')?.setValue(this.filter.dateEnd);
            this.eventosForm.get('dateStart')?.setValue(this.filter.dateStart);
            this.eventosForm.get('fee')?.setValue(this.filter.fee);
            this.eventosForm.get('source')?.setValue(this.filter.source);
            this.eventosForm.get('orderBy')?.setValue(this.filter.orderBy);
            this.eventosForm.get('perPage')?.setValue(this.filter.perPage);
        });

    }
}
