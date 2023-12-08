import { Component } from '@angular/core';
import { ModalesService } from 'src/factory/modales.service';
@Component({
  selector: 'app-modales',
  templateUrl: './modales.component.html',
  styleUrls: ['./modales.component.css']
})
export class ModalesComponent {
  constructor(public modales:ModalesService){

  }

}
