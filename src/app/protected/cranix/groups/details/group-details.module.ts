import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { GroupDetailsPage } from './group-details.page';
import { GroupEditPage } from './edit/group-edit.page';
import { GroupMembersPage } from './members/group-members.page';

const routes: Routes = [
  {
    path: '',
    component: GroupDetailsPage,
    children: [
      {
        path: 'all',
        redirectTo: '/pages/cranix/groups'
      },
      {
        path: 'edit',
        component:  GroupEditPage
      },
      {
        path: 'members',
       component: GroupMembersPage
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
  declarations: [GroupDetailsPage,GroupEditPage,GroupMembersPage]
})
export class GroupDetailsPageModule { }
