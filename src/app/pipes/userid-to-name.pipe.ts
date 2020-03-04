import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from '../services/generic-object.service'
@Pipe({
  name: 'userIdToName'
})
export class UseridToNamePipe implements PipeTransform {
  constructor(private gOS: GenericObjectService) { }
  transform(value: any, ...args: any[]): any {
    for (let obj of this.gOS.allObjects['user']) {
      if (obj.id === value) {
        return obj.uid + " (" + obj.givenName + " " + obj.surName + ")";
      }
    }
    return value;
  }
}