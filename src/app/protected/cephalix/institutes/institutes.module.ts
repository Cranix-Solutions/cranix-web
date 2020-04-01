import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from '../../../services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { InstitutesPage } from './institutes.page';

const routes: Routes = [
  {
    path: 'institutes',
    canActivate: [CanActivateViaAcls],
    component: InstitutesPage
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
  declarations: [ InstitutesPage ],
  providers: [TranslateService, PipesModule]
})
export class InstitutesPageModule {}
