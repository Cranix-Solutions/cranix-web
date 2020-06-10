import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-rooms-lists',
  templateUrl: './rooms-lists.page.html'
})      
export class RoomsListsPage {
  constructor(
    public translateService: TranslateService
  ) {}  
}
