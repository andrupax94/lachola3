import { Component } from '@angular/core';
import { MensajesService } from 'src/factory/mensajes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaService } from 'src/factory/carga.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SessionService } from 'src/factory/session.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
    public logInForm: FormGroup;
    public logInErrorMensaje: string = '';
    constructor(
        private mensaje: MensajesService,
        private formBuilder: FormBuilder,
        private carga: CargaService,
        private session: SessionService,
        private router: Router
    ) {
        this.logInForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(100)]],
            password: ['', [
                Validators.required,
                Validators.minLength(4), // Ajusta la longitud mínima de la contraseña a 6 caracteres
            ]]
        });

    }
    public borraMensaje() {
        this.logInErrorMensaje = '';
    }
    public submitLogIn() {
        this.carga.to('body', '', true);
        this.carga.play();

        this.session.logIn(this.logInForm.get('username')?.value, this.logInForm.get('password')?.value).subscribe({
            next: (data) => {
                this.carga.pause();
                if (data.body !== true) {
                    this.logInErrorMensaje = data.body;
                }
                else {
                    this.router.navigate(['/']);
                }
            }, error: (error) => {
                console.log(error);
                this.carga.pause();
            }
        });

    }






    ngOnInit() {
        this.carga.pause();
        $('.message a').click(function () {
            $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        });

    }

}
