import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';

import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsPage, EditArticle } from './details.page';
import { TranslateService } from '@ngx-translate/core';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { simpleToolbarOptions } from 'src/app/shared/models/constants'

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    QuillModule.forRoot({
      modules: { toolbar: simpleToolbarOptions},
    })
  ],
  declarations: [DetailsPage, EditArticle],
  providers: [TranslateService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsPageModule { }
