import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { InstituteDetailsPageModule } from './details/institute-details.module';
import { InstitutesListsPageModule } from './lists/institutes-lists.module';
import { PipesModule } from 'src/app/pipes/pipe-modules';

import { InstitutesListsPage } from './lists/institutes-lists.page';
import { InstitutesComponent } from './lists/institutes.component';
import { InstitutesStatusComponent } from './lists/institutes-status.component';
import { InstitutesSyncObjectsComponent } from './lists/institutes-sync-objects.component';
import { InstitutesManage } from './lists/institutes.manage';

const routes: Routes = [
  {
    path: 'institutes',
    canActivate: [CanActivateViaAcls],
    loadChildren: () => import('./lists/institutes-lists.module').then( m => m.InstitutesListsPageModule)
  },
  {
    path: 'institutes/:id',
    canLoad: [CanActivateViaAcls],
    loadChildren: () => import('./details/institute-details.module').then( m => m.InstituteDetailsPageModule)
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
export class InstitutesPageModule {}
