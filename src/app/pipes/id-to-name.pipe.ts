import { Pipe, PipeTransform } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service'
import { LanguageService } from '../services/language.service';
@Pipe({
  name: 'idToName'
})
export class IdToNamePipe implements PipeTransform {

  constructor(
    private gOS: GenericObjectService,
    private languageService: LanguageService
  ) { }

  transform(value: any, objectType: string): string {
    if (value == 0) {
      return this.languageService.trans("nothing");
    }
    let obj = this.gOS.getObjectById(objectType, value);
    if( !obj ) {
      return this.languageService.trans("nothing");
    }
    if (obj.name ) {
      return obj.name;
    }
    if( obj.uid ) {
      console.log("uid found")
      return obj.uid + " (" + obj.givenName + " " + obj.surName + ")";
    }
    return value;
  }
}
