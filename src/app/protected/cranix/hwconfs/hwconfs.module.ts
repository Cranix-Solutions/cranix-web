import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { HwconfsPage } from './hwconfs.page';

const routes: Routes = [
  {
    path: 'hwconfs',
    canActivate: [CanActivateViaAcls],
    component: HwconfsPage
  },
  {
    path: 'hwconfs/:id',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./details/hwconf-details.module').then( m => m.HwconfDetailsPageModule)
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
