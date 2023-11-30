import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Ruta1Component } from './ruta1/ruta1.component';
import { Ruta2Component } from './ruta2/ruta2.component';
import { Ruta3Component } from './ruta3/ruta3.component';
import { Ruta4Component } from './ruta4/ruta4.component';

@NgModule({
  declarations: [
    AppComponent,
    Ruta1Component,
    Ruta2Component,
    Ruta3Component,
    Ruta4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
