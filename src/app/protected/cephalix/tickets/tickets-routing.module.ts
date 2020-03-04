import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsPage } from './tickets.page';

const routes: Routes = [
  {
    path: '',
    component: TicketsPage
  },
  {
  path: 'details/:id',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsPageRoutingModule {}
