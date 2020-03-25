import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from '../../../shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { GroupsPage } from './groups.page';

const routes: Routes = [
  {
    path: 'groups',
    component: GroupsPage
  },
  {
    path: 'groups/:id',
    loadChildren: () => import('./details/groups-details.module').then( m => m.GroupDetailsPageModule)
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
  declarations: [ GroupsPage ],
  providers: [TranslateService, PipesModule]
})
export class GroupsPageModule {}
