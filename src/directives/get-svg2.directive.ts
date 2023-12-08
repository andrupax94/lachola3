import { Directive, ElementRef } from '@angular/core';
import { FactoryService } from 'src/factory/factory.module';

@Directive({
  selector: '[getSvg2]'
})
export class GetSvg2Directive {

  constructor(private element:ElementRef,private factory:FactoryService) {
      factory.getsvg(element.nativeElement,'2');
   }

}

