import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

//own modules
import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { TicketsPage } from './tickets.page';

const routes: Routes = [
  {
    path: 'tickets',
    component: TicketsPage
  },
  {
    path: 'tickets/:id',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
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
