import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service'
@Pipe({
  name: 'idToName'
})
export class IdToNamePipe implements PipeTransform {

  constructor(private gOS: GenericObjectService) { }

  transform(value: any, objectType: string ): string {
    for (let obj of this.gOS.allObjects[objectType].getValue()) {
      if (obj.id === value) {
        return obj.name;
      }
    }
    return value;
  }
}
