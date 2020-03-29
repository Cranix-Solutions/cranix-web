import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//own stuff
import { ProtectedPage } from './protected.page';
import { CanActivateViaAcls } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateViaAcls],
    component: ProtectedPage
  },
  {
    path: 'customers',
     canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cephalix/customers/customers.module').then( m => m.CustomersPageModule)
  },
  {
    path: 'institutes',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cephalix/institutes/institutes.module').then( m => m.InstitutesPageModule)
  },
  {
    path: 'users',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cranix/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'groups',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cranix/groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'hwconfs',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cranix/hwconfs/hwconfs.module').then( m => m.HwconfsPageModule)
  },
  {
    path: 'rooms',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cranix/rooms/rooms.module').then( m => m.RoomsPageModule)
  },
  {
    path: 'devices',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cranix/devices/devices.module').then( m => m.DevicesPageModule)
  },
  {
    path: 'tickets',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./cephalix/tickets/tickets.module').then( m => m.TicketsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedPageRoutingModule {}
