import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from '../services/generic-object.service'
@Pipe({
  name: 'roomIdToName'
})
export class RoomidToNamePipe implements PipeTransform {
  constructor(private gOS: GenericObjectService) { }
  transform(value: any, ...args: any[]): any {
    for (let obj of this.gOS.allObjects['room']) {
      if (obj.id === value) {
        return obj.name;
      }
    }
    return value;
  }
}
