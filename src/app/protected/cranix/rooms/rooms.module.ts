import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from '../../../pipes/pipe-modules';
import { RoomsPage } from './rooms.page';

const routes: Routes = [
  {
    path: 'rooms',
    component: RoomsPage
  },
  {
    path: 'room/:id',
    loadChildren: () => import('./details/room-details.module').then( m => m.RoomDetailsPageModule)
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
  declarations: [ RoomsPage ],
  providers: [TranslateService, PipesModule]
})
export class RoomsPageModule {}
