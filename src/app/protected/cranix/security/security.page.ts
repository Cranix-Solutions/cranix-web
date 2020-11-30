import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage {
  constructor(
    public authS: AuthenticationService,
    public translateService: TranslateService
  ) {}
}
