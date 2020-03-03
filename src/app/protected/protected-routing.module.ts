import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtectedPage } from './protected.page';

const routes: Routes = [
  {
    path: '',
    component: ProtectedPage
  },
  {
    path: 'customers',
    loadChildren: () => import('./cephalix/customers/customers.module').then( m => m.CustomersPageModule)
  },
  {
    path: 'institutes',
    loadChildren: () => import('./cephalix/institutes/institutes.module').then( m => m.InstitutesPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./cranix/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./cranix/groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'hwconfs',
    loadChildren: () => import('./cranix/hwconfs/hwconfs.module').then( m => m.HwconfsPageModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./cranix/rooms/rooms.module').then( m => m.RoomsPageModule)
  },
  {
    path: 'devices',
    loadChildren: () => import('./cranix/devices/devices.module').then( m => m.DevicesPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./cephalix/tickets/tickets.module').then( m => m.TicketsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedPageRoutingModule {}
