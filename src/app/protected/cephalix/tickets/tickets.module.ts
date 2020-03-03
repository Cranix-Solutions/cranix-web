import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { TicketsPage } from './tickets.page';
import { TranslateService } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: 'tickets',
    component: TicketsPage
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
  declarations: [TicketsPage],
  providers: [TranslateService]
})
export class TicketsPageModule {}
