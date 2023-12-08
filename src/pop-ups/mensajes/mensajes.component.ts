import { Component } from '@angular/core';
import { MensajesService } from 'src/factory/mensajes.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent {
constructor(public mensajes:MensajesService,){
  this.mensajes=mensajes;
}
}
