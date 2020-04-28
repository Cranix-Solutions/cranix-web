import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-system',
  templateUrl: './system.page.html'
})
export class SystemPage {
  constructor(
    public translateService: TranslateService
  ) {}
}
