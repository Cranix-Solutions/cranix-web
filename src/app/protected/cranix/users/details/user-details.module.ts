import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { UserDetailsPage } from './user-details.page';
import { UserEditPage } from './edit/user-edit.page';
import { UserGroupsPage } from './groups/user-groups.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailsPage,
    children: [
      {
        path: 'all',
        redirectTo: '/pages/cranix/users'
      },
      {
        path: 'edit',
        component:  UserEditPage
      },
      {
        path: 'groups',
       component: UserGroupsPage
      },
      {
        path: '',
        redirectTo: 'edit'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'edit'
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
  declarations: [UserDetailsPage,UserEditPage,UserGroupsPage]
})
export class UserDetailsPageModule { }
