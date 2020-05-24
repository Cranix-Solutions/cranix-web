import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { DevicesListsPage }   from './devices-lists.page';
import { DevicesComponent }   from './devices.component';
import { PrintersComponent }  from './printers.component';

const routes: Routes = [
  {
    path: '',
    component: DevicesListsPage,
    children: [
      {
        path: 'all',
        component:  DevicesComponent
      },
      {
        path: 'printers',
        component: PrintersComponent
      },
      {
        path: '',
        redirectTo: 'all'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'all'
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
  declarations: [DevicesListsPage,DevicesComponent,PrintersComponent]
})
export class DevicesListsModule { }

