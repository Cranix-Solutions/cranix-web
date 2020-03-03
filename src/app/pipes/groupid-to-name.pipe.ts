import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupIdToName'
})
export class GroupidToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
