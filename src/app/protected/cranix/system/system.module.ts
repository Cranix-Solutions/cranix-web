import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { SystemPage } from './system.page';
import { SystemStatusComponent }  from './status/system-status.component';
import { SystemConfigComponent }  from './config/system-config.component';
import { SystemSupportComponent } from './support/system-support.component';
import { SystemAddonsComponent }  from './addons/system-addons.component';

const routes: Routes = [
  {
    path: 'system',
    component: SystemPage,
    children: [
      {
        path: 'status',
        component:  SystemStatusComponent
      },
      {
        path: 'config',
        component: SystemConfigComponent
      },
      {
        path: 'support',
        component: SystemSupportComponent
      },
      {
        path: 'addons',
        component: SystemAddonsComponent
      },
      {
        path: '',
        redirectTo: 'status'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'status'
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
  declarations: [SystemPage,SystemStatusComponent,SystemConfigComponent,SystemSupportComponent,SystemAddonsComponent]
})
export class SystemPageModule { }
