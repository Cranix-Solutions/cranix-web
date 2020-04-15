import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsPage } from './details.page';
import { TranslateService } from '@ngx-translate/core';

import {CranixSharedModule} from 'src/app/shared/cranix-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    CranixSharedModule
  ],
  declarations: [DetailsPage],
  providers: [TranslateService]
})
export class DetailsPageModule {}
