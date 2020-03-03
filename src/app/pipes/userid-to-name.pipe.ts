import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userIdToName'
})
export class UseridToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
