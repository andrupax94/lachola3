import { Component } from '@angular/core';
import { MensajesService } from 'src/factory/mensajes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaService } from 'src/factory/carga.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
    public logInForm: FormGroup;
    constructor(
        private mensaje: MensajesService,
        private formBuilder: FormBuilder,
        private carga: CargaService,
    ) {
        this.logInForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(100)]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
            ]]
        });

    }
    public submitLogIn() {
        this.carga.to('body', '', true);
        this.carga.play();
        setTimeout(() => {
            this.carga.pause();
        }, 200);
    }






    ngOnInit() {
        this.carga.pause();
        $('.message a').click(function () {
            $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        });

    }

}
