import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupidToNamePipe} from './groupid-to-name.pipe';
import {InstituteidToNamePipe} from './instituteid-to-name.pipe';
import {RoomidToNamePipe} from './roomid-to-name.pipe';
import {UseridToNamePipe} from './userid-to-name.pipe';
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe],
  providers: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe],
  declarations: [GroupidToNamePipe,InstituteidToNamePipe,RoomidToNamePipe,UseridToNamePipe]
})
export class PipesModule { }
