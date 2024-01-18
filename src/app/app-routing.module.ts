import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerEventosComponent } from './verEventos/verEventos.component';
import { ExEventosComponent } from './ex-eventos/ex-eventos.component';
import { VerSubvencionesComponent } from './ver-subvenciones/ver-subvenciones.component';
import { ExSubvencionesComponent } from './ex-subvenciones/ex-subvenciones.component';
import { authGuard } from './guards/auth.guard';
import { procesing } from './guards/procesing.guard';
import { LogInComponent } from './log-in/log-in.component';


const routes: Routes = [
    { path: '', component: VerEventosComponent, canActivate: [procesing, authGuard] },
    { path: 'verEventos', component: VerEventosComponent, canActivate: [procesing, authGuard] },
    { path: 'exEventos', component: ExEventosComponent, canActivate: [procesing, authGuard] },
    { path: 'verSubvenciones', component: VerSubvencionesComponent, canActivate: [procesing, authGuard] },
    { path: 'exSubvenciones', component: ExSubvencionesComponent, canActivate: [procesing, authGuard] },
    { path: 'logIn', component: LogInComponent, canActivate: [procesing, authGuard] },
    // Puedes agregar más rutas según sea necesario
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
