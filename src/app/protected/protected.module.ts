import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ProtectedPage } from './protected.page';
import { RouterModule,Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProtectedPage,
    children: [
        { path: 'cephalix',
          loadChildren: () => import('./cephalix/cephalix.module').then( m => m.CephalixModule)
        },
        { path: 'cranix',
          loadChildren: () => import('./cranix/cranix.module').then(m => m.CranixModule)
        }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProtectedPage]
})
export class ProtectedPageModule {}
