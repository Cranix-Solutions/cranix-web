import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from '../services/generic-object.service'
import { Institute } from '../shared/models/cephalix-data-model'

@Pipe({
  name: 'instituteIdToName'
})
export class InstituteidToNamePipe implements PipeTransform {

  constructor(private gOS: GenericObjectService) {
  }
  transform(value: any, ...args: any[]): any {
    console.log("instituteIdToName");
    console.log(value);
    for (let inst of this.gOS.allObjects['institute']) {
      if (inst.id === value) {
        return inst.name;
      }
    }
    return value;
  }
}
