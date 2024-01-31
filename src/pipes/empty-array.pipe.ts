import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyArray'
})
export class EmptyArrayPipe implements PipeTransform {

    transform(value: any): any[] {
        return Array.from({ length: value });
      }

}
