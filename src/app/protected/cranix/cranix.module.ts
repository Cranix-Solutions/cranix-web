import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
//Own Stuff
import { DevicesPageModule }   from './devices/devices.module';
import { HwconfsPageModule }   from './hwconfs/hwconfs.module';
import { GroupsPageModule }    from './groups/groups.module';
import { RoomsPageModule }     from  './rooms/rooms.module';
import { SecurityPageModule }  from './security/security.module';
import { SoftwaresPageModule } from './softwares/softwares.module';
import { SystemPageModule }    from './system/system.module';
import { UsersPageModule }     from './users/users.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DevicesPageModule,
    HwconfsPageModule,
    GroupsPageModule,
    RoomsPageModule,
    SecurityPageModule,
    SoftwaresPageModule,
    SystemPageModule,
    UsersPageModule
  ]
})
export class CranixModule { }
