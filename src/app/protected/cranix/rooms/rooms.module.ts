import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RoomsPage } from './rooms.page';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { RoomsService } from 'src/app/services/rooms.service';

const routes: Routes = [
  {
    path: 'rooms',
    component: RoomsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomsPage],
  providers: [RoomsService ]
})
export class RoomsPageModule {}
