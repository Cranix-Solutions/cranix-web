import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule }        from 'src/app/pipes/pipe-modules';
import { MyUsersPage }       from './myusers.page';

const routes: Routes = [
  {
    path: 'myusers',
    canActivate: [CanActivateViaAcls],
    component: MyUsersPage
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
  declarations: [ MyUsersPage],
  providers: [TranslateService, PipesModule]
})
export class MyUsersPageModule {}

