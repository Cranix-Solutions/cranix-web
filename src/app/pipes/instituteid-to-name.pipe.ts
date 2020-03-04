import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from '../services/generic-object.service'
@Pipe({
  name: 'instituteIdToName'
})
export class InstituteidToNamePipe implements PipeTransform {

  constructor(private gOS: GenericObjectService) {
  }
  transform(value: any, ...args: any[]): any {
    for (let inst of this.gOS.allObjects['institute']) {
      if (inst.id === value) {
        return inst.name;
      }
    }
    return value;
  }
}
