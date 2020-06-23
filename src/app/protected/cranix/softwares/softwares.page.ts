import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-softwares',
  templateUrl: './softwares.page.html',
  styleUrls: ['./softwares.page.scss'],
})
export class SoftwaresPage {
  constructor(
    public translateService: TranslateService,
    public authService: AuthenticationService
  ) {}
}
