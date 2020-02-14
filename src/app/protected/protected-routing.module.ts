import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtectedPage } from './protected.page';

const routes: Routes = [
  {
    path: '',
    component: ProtectedPage
  },
  {
    path: 'institutes',
    loadChildren: () => import('./cephalix/institutes/institutes.module').then( m => m.InstitutesPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./cranix/users/users.module').then( m => m.UsersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedPageRoutingModule {}
