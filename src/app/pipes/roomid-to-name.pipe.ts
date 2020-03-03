import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roomidToName'
})
export class RoomidToNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
