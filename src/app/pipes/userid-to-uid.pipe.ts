import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service'
@Pipe({
  name: 'userIdToUid'
})
export class UseridToUidPipe implements PipeTransform {
  constructor(private gOS: GenericObjectService) { }
  transform(value: any, ...args: any[]): any {
    for (let obj of this.gOS.allObjects['user'].getValue()) {
      if (obj.id === value) {
        return obj.uid ;
      }
    }
    return value;
  }
}
