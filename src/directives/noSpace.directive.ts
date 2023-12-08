

import { Directive,ElementRef } from '@angular/core';

@Directive({
  selector: '[noSpace]',
})
// impide el uso de espacios en inputs
export class NoSpaceDirective {
  constructor(private element:ElementRef) {

     element.nativeElement.addEventListener("keydown", function(event:KeyboardEvent) {
         if (event.keyCode == 32) {
          event.preventDefault();
          return false;
         }
         else{
          return true;
         }
      });
   }

}
