import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { UsersPage } from './users.page';

const routes: Routes = [
  {
    path: 'users',
    component: UsersPage
  },
  {
    path: 'users/:id',
    loadChildren: () => import('./details/user-details.module').then( m => m.UserDetailsPageModule)
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
  declarations: [ UsersPage],
  providers: [TranslateService, PipesModule]
})
export class UsersPageModule {}
