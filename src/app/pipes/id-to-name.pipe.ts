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
    )
     { }

  transform(value: any, objectType: string ): string {
    if ( value == 0 ) {
      return this.languageService.trans("nothing");
    }
    for (let obj of this.gOS.allObjects[objectType].getValue()) {
      if (obj.id === value) {
        return obj.name;
      }
    }
    return value;
  }
}
