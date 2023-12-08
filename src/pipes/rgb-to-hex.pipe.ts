import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rgbToHex'
})
export class RgbToHexPipe implements PipeTransform {
// convierte un rgb a hex nada mas, ejemplo   "[['rgb(38, 50, 56)'|rgbToHex]]"

  transform(rgbT: string): unknown {
    function componentToHex(cT:string) {
      let c = parseInt(cT);
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
   }
   let rgb= rgbT.replace(/[rgba() ]/g, "").split(',');
   return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
  }

}
