import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ruta1Component } from './ruta1/ruta1.component';
import { Ruta2Component } from './ruta2/ruta2.component';
import { Ruta3Component } from './ruta3/ruta3.component';
import { Ruta4Component } from './ruta4/ruta4.component';

const routes: Routes = [
  { path: 'ruta1', component: Ruta1Component },
  { path: 'ruta2', component: Ruta2Component },
  { path: 'ruta3', component: Ruta3Component },
  { path: 'ruta4', component: Ruta4Component },
  // Puedes agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
