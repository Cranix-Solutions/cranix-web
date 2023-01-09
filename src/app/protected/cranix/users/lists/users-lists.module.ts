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
import { UserGroupsPage } from '../details/groups/user-groups.page';
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
  declarations: [UsersListsPage,UsersComponent,UsersImportComponent,UserGroupsPage]
})
export class UsersListsPageModule { }

