import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-users-lists',
  templateUrl: './users-lists.page.html'
})
export class UsersListsPage {
  constructor(
    public translateService: TranslateService
  ) {}
}
