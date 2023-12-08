import { Component } from '@angular/core';
import { MensajesService } from 'src/factory/mensajes.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
constructor(private mensaje:MensajesService) {

}
ngOnInit(){
    $('.message a').click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
     });
     this.mensaje.add('ok','hola');
}

}
