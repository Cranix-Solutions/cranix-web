import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupidToNamePipe} from './groupid-to-name.pipe';
import {InstituteidToNamePipe} from './instituteid-to-name.pipe';
import {RoomidToNamePipe} from './roomid-to-name.pipe';
import {UseridToNamePipe} from './userid-to-name.pipe';
import {UseridToUidPipe} from './userid-to-uid.pipe';
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe,UseridToUidPipe],
  providers: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe,UseridToUidPipe],
  declarations: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe,UseridToUidPipe]
})
export class PipesModule { }
