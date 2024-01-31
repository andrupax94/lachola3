
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LogInComponent } from './log-in/log-in.component';
import { PopUpsModule } from 'src/pop-ups/pop-ups.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterComponent } from './filter/filter.component';
import { ExEventosComponent } from './ex-eventos/ex-eventos.component';
import { ExSubvencionesComponent } from './ex-subvenciones/ex-subvenciones.component';
import { VerSubvencionesComponent } from './ver-subvenciones/ver-subvenciones.component';
import { VerEventosComponent } from './verEventos/verEventos.component';
import * as $from from 'jquery';
import gsap from 'gsap';
import { ErrorInterceptor } from 'src/app/httpInterceptor';


@NgModule({
    declarations: [
        AppComponent,
        LogInComponent,
        VerEventosComponent,
        FilterComponent,
        ExEventosComponent,
        ExSubvencionesComponent,
        VerSubvencionesComponent,
    ],
    imports: [
        BrowserModule,
        PopUpsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    exports: [
    ],
    providers: [
        DatePipe,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: APP_BASE_HREF, useValue: environment.apiUrl },
        [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: ErrorInterceptor,
                multi: true
            }
        ]
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
