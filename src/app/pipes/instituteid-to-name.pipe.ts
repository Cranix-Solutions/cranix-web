import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instituteidToName'
})
export class InstituteidToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
