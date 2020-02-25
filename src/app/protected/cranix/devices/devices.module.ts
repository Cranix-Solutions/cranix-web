import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DevicesPage } from './devices.page';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { DevicesService } from 'src/app/services/devices.service';

const routes: Routes = [
  {
    path: 'devices',
    component: DevicesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DevicesPage],
  providers: [
    DevicesService
  ]
})
export class DevicesPageModule {}
