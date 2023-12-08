import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevertirFechaPipe } from './revertir-fecha.pipe';
import { SplitPipe } from './split.pipe';
import { StringToArrayPipe } from './string-to-array.pipe';
import { ArrayToStringPipe } from './array-to-string.pipe';
import { RellenarConCerosPipe } from './rellenar-con-ceros.pipe';
import { QuitarCaracterPipe } from './quitar-caracter.pipe';
import { RgbToHexPipe } from './rgb-to-hex.pipe';
import { PrecioPipe } from './precio.pipe';


@NgModule({
  declarations: [RevertirFechaPipe,
    SplitPipe,
    StringToArrayPipe,
    ArrayToStringPipe,
    RellenarConCerosPipe,
    QuitarCaracterPipe,
    RgbToHexPipe,
    PrecioPipe],
  imports: [
    CommonModule
  ],
  exports:[
    SplitPipe,
    StringToArrayPipe,
    ArrayToStringPipe,
    RellenarConCerosPipe,
    QuitarCaracterPipe,
    RgbToHexPipe,
    PrecioPipe
  ]
})
export class PipesModule { }
