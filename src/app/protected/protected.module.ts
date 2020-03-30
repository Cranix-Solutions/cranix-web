import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import {CranixSharedModule } from '../shared/cranix-shared.module';
import { ProtectedPage } from './protected.page';

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
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProtectedPage]
})
export class ProtectedPageModule {}
