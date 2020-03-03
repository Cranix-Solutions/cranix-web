import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupidToName'
})
export class GroupidToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
