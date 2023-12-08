import { Component, Output } from '@angular/core';
import { VentanaService } from 'src/factory/ventana.service';

@Component({
  selector: 'pop-ups',
  templateUrl: './pop-ups.component.html',
  styleUrls: ['./pop-ups.component.css']
})
export class PopUpsComponent {

constructor(public ventana:VentanaService){
  this.template=ventana.template;
}
template:string|undefined=undefined;

}
