import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-devices-lists',
  templateUrl: './devices-lists.page.html'
})      
export class DevicesListsPage {
  constructor(
    public translateService: TranslateService
  ) {}  
}
