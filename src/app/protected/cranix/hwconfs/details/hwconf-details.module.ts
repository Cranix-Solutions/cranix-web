import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { HwconfDetailsPage } from './hwconf-details.page';
import { HwconfEditPage } from './edit/hwconf-edit.page';
import { HwconfMembersPage } from './members/hwconf-members.page';

const routes: Routes = [
  {
    path: '',
    component: HwconfDetailsPage,
    children: [
      {
        path: 'all',
        redirectTo: '/pages/cranix/hwconfs', pathMatch: 'full'
      },
      {
        path: 'edit',
        component:  HwconfEditPage
      },
      {
        path: 'members',
       component: HwconfMembersPage
      },
      {
        path: '',
        redirectTo: 'edit', pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'edit', pathMatch: 'full'
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
  declarations: [HwconfDetailsPage,HwconfEditPage,HwconfMembersPage]
})
export class HwconfDetailsPageModule { }
