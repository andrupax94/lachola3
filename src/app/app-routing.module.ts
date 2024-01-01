import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerEventosComponent } from './verEventos/verEventos.component';
import { ExEventosComponent } from './ex-eventos/ex-eventos.component';
import { VerSubvencionesComponent } from './ver-subvenciones/ver-subvenciones.component';
import { ExSubvencionesComponent } from './ex-subvenciones/ex-subvenciones.component';
import { authGuard } from './auth.guard';
import { LogInComponent } from './log-in/log-in.component';


const routes: Routes = [
    { path: '', component: VerEventosComponent, canActivate: [authGuard] },
    { path: 'verEventos', component: VerEventosComponent, canActivate: [authGuard] },
    { path: 'exEventos', component: ExEventosComponent, canActivate: [authGuard] },
    { path: 'verSubvenciones', component: VerSubvencionesComponent, canActivate: [authGuard] },
    { path: 'exSubvenciones', component: ExSubvencionesComponent, canActivate: [authGuard] },
    { path: 'logIn', component: LogInComponent, canActivate: [authGuard] },
    // Puedes agregar más rutas según sea necesario
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
