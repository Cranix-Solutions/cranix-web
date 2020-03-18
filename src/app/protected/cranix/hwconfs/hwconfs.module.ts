import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { HwconfsPage } from './hwconfs.page';

const routes: Routes = [
  {
    path: 'hwconfs',
    component: HwconfsPage
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
  declarations: [ HwconfsPage ],
  providers: [TranslateService, PipesModule]
})
export class HwconfsPageModule {}
