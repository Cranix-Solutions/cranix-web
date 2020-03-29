import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { DevicesPage } from './devices.page';

const routes: Routes = [
  {
    path: 'devices',
    component: DevicesPage
  },
  {
    path: 'devices/:id',
    loadChildren: () => import('./details/device-details.module').then( m => m.DeviceDetailsPageModule)
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
  declarations: [ DevicesPage ],
  providers: [TranslateService, PipesModule]
})
export class DevicesPageModule {}
