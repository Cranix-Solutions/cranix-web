import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { RoomDetailsPage } from './room-details.page';
import { RoomEditPage } from './edit/room-edit.page';
import { RoomPrintersPage } from './printers/room-printers.page';
import { RoomDevicesPage } from './devices/room-devices.page';

const routes: Routes = [
  {
    path: '',
    component: RoomDetailsPage,
    children: [
      {
        path: 'all',
        redirectTo: '/pages/cranix/rooms'
      },
      {
        path: 'edit',
        component:  RoomEditPage
      },
      {
        path: 'printers',
       component: RoomPrintersPage
      },
      {
        path: 'devices',
       component: RoomDevicesPage
      },
      {
        path: '',
        redirectTo: 'edit'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'edit'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomDetailsPage,RoomEditPage,RoomDevicesPage,RoomPrintersPage]
})
export class RoomDetailsPageModule { }
