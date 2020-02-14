import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { InstitutesPage } from './institutes.page';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'institutes',
    component: InstitutesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    
    CranixSharedModule
  ],
  declarations: [InstitutesPage],
  providers: [TranslateService]
})
export class InstitutesPageModule {}
