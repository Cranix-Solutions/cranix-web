import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { UsersListsPage } from './users-lists.page';
import { UsersComponent } from './users.component';
import { UsersImportComponent } from './users-import.component';
import { Users2faComponent } from './users-2fa';
import { UserGroupsPage } from '../details/groups/user-groups.page';
import { ManageParentsComponent } from './manage-parents/manage-parents.component'
import { IdCardsComponent } from './id-cards/id-cards.component'
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'users', pathMatch: 'prefix',
    canActivate: [CanActivateViaAcls],
    component: UsersListsPage,
    children: [
      {
        path: 'all',
        component:  UsersComponent
      },
      {
        path: 'import',
        component: UsersImportComponent
      },{
        path: 'crx2fa',
        component: Users2faComponent
      },{
        path: 'parents',
        component: ManageParentsComponent
      },{
        path: 'idcards',
        component: IdCardsComponent
      },
      {
        path: '', pathMatch: 'full',
        redirectTo: 'all'
      }
    ]
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
  declarations: [
    UsersListsPage,
    UsersComponent,
    UsersImportComponent,
    Users2faComponent,
    UserGroupsPage,
    ManageParentsComponent,
    IdCardsComponent
  ]
})
export class UsersListsPageModule { }

