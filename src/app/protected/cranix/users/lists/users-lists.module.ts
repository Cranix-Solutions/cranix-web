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
import { UserGroupsPage } from '../details/groups/user-groups.page'

const routes: Routes = [
  {
    path: '',
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
        path: '',
        redirectTo: 'all'
      }
    ]
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
    IonicModule,
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UsersListsPage,UsersComponent,UsersImportComponent,UserGroupsPage]
})
export class UsersListsPageModule { }

