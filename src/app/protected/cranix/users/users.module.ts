import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UsersPage } from './users.page';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { UsersService } from 'src/app/services/users.service';

const routes: Routes = [
  {
    path: 'users',
    component: UsersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UsersPage,],
  providers: [
    UsersService
  ]
})
export class UsersPageModule {}
