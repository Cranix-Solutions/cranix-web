import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { RoomPrintersPage } from 'src/app/protected/cranix/rooms/details/printers/room-printers.page';

const routes: Routes = [
  {
    path: 'rooms',
    canActivate: [CanActivateViaAcls],
    loadChildren: () => import('./lists/rooms-lists.module').then( m => m.RoomsListsModule)
  },
  {
    path:        '',
    redirectTo: 'all'
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
  declarations: [ RoomPrintersPage ],
  providers: [TranslateService, PipesModule]
})
export class RoomsPageModule {}
