import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSpaceDirective } from './noSpace.directive';
import { GetsvgDirective } from './getsvg.directive';
import { PlaceHolderTopDirective } from './place-holder-top.directive';
import { ValidarKDirective } from './validar-k.directive';
import { FileReadDirective } from './file-read.directive';
import { GetSvg2Directive } from './get-svg2.directive';
import { Getsvg3Directive } from './get-svg3.directive';
import { AnimaDirective } from './anima-click.directive';
import { InputIconDirective } from './input-icon.directive';


@NgModule({
  declarations: [  NoSpaceDirective,
    GetsvgDirective,
    PlaceHolderTopDirective,
    ValidarKDirective,
    FileReadDirective,
    GetSvg2Directive,
    Getsvg3Directive,
    AnimaDirective,
    InputIconDirective
    ],
  imports: [
    CommonModule,
  ],
  exports:[
    NoSpaceDirective,
GetsvgDirective,
PlaceHolderTopDirective,
ValidarKDirective,
FileReadDirective,
GetSvg2Directive,
Getsvg3Directive,
AnimaDirective,
InputIconDirective
  ]
})
export class DirectivesModule { }
