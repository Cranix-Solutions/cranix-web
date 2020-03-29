import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from '../../../../shared/cranix-shared.module';
import { DeviceDetailsPage } from './device-details.page';
import { DeviceEditPage } from './edit/device-edit.page';
import { DevicePrintersPage } from './printers/device-printers.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceDetailsPage,
    children: [
      {
        path: 'edit',
        component:  DeviceEditPage
      },
      {
        path: 'printers',
       component: DevicePrintersPage
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
  declarations: [DeviceDetailsPage,DeviceEditPage,DevicePrintersPage]
})
export class DeviceDetailsPageModule { }
