import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpsComponent } from './pop-ups.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { VentanasComponent } from './ventanas/ventanas.component';
import { ModalesComponent } from './modales/modales.component';


@NgModule({
  declarations: [
    PopUpsComponent,
MensajesComponent,
VentanasComponent,
ModalesComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PopUpsComponent,
    MensajesComponent,
    VentanasComponent,
    ModalesComponent
  ]
})
export class PopUpsModule { }
