import { Component } from '@angular/core';
import { VentanaService } from 'src/factory/ventana.service';

@Component({
  selector: 'app-ventanas',
  templateUrl: './ventanas.component.html',
  styleUrls: ['./ventanas.component.css']
})
export class VentanasComponent {
constructor(public ventana:VentanaService){}


}
