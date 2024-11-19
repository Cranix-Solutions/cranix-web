import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-system',
  templateUrl: './system.page.html'
})
export class SystemPage {
  constructor(
    public translateService: TranslateService,
    public authService: AuthenticationService
  ) {}
}
