import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from '../../../../shared/cranix-shared.module';
import { RoomDetailsPage } from './room-details.page';
import { RoomEditPage } from './edit/room-edit.page';
import { RoomPrintersPage } from './printers/room-printers.page';

const routes: Routes = [
  {
    path: '',
    component: RoomDetailsPage,
    children: [
      {
        path: 'edit',
        component:  RoomEditPage
      },
      {
        path: 'printers',
       component: RoomPrintersPage
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
  declarations: [RoomDetailsPage,RoomEditPage,RoomPrintersPage]
})
export class RoomDetailsPageModule { }
