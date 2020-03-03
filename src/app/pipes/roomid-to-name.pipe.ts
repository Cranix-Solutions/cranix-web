import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roomIdToName'
})
export class RoomidToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
