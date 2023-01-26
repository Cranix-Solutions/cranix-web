import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { RoomsListsPage }   from './rooms-lists.page';
import { RoomsComponent }   from './rooms.component';
import { AdhocComponent }  from './adhoc.component';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { RoomPrintersPage } from 'src/app/protected/cranix/rooms/details/printers/room-printers.page';

const routes: Routes = [
  {
    path: 'rooms',
    canActivate: [CanActivateViaAcls],
    component: RoomsListsPage,
    children: [
      {
        path: 'all',
        component:  RoomsComponent
      },
      {
        path: 'adhoc',
        component: AdhocComponent
      },
      {
        path: '',
        redirectTo: 'all', pathMatch: 'full'
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
  declarations: [RoomsListsPage,RoomsComponent,AdhocComponent,RoomPrintersPage]
})
export class RoomsListsModule { }

