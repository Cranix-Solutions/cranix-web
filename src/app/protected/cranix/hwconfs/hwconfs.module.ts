import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { HwconfsPage } from './hwconfs.page';
import { HwconfsService } from '../../../services/hwconfs.service';


const routes: Routes = [
  {
    path: 'hwconfs',
    component: HwconfsPage
  }
];

@NgModule({
  imports: [
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HwconfsPage],
  providers:[HwconfsService]
})
export class HwconfsPageModule {}
