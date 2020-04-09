import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from '../../../services/auth-guard.service';
import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [CanActivateViaAcls],
    loadChildren: () => import('./lists/users-lists.module').then( m => m.UsersListsPageModule)
  },
  {
    path: 'users/:id',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./details/user-details.module').then( m => m.UserDetailsPageModule)
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
    RouterModule.forChild(routes),
    IonicModule,
    CranixSharedModule
  ],
  declarations: [ ],
  providers: [TranslateService, PipesModule]
})
export class UsersPageModule {}
