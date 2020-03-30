import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cranix-hwconf-details',
  templateUrl: './hwconf-details.page.html',
  styleUrls: ['./hwconf-details.page.scss'],
})
export class HwconfDetailsPage {
  constructor(
    public translateService: TranslateService
  ) {}
}
