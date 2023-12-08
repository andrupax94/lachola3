import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { Ruta1Component } from './ruta1/ruta1.component';
import { Ruta2Component } from './ruta2/ruta2.component';
import { Ruta3Component } from './ruta3/ruta3.component';
import { Ruta4Component } from './ruta4/ruta4.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LogInComponent } from './log-in/log-in.component';
import { PopUpsModule } from 'src/pop-ups/pop-ups.module';
import {FormsModule,ReactiveFormsModule } from '@angular/forms';
import * as $from from 'jquery';
import gsap from 'gsap';
@NgModule({
  declarations: [
    AppComponent,
    Ruta1Component,
    Ruta2Component,
    Ruta3Component,
    Ruta4Component,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    PopUpsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  exports:[

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide: APP_BASE_HREF, useValue: environment.apiUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
