import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
//Own Stuff
import { CalendarModule } from './calendar/calendar.module'
import { DevicesListsModule } from './devices/lists/devices-lists.module';
import { HwconfsPageModule }   from './hwconfs/hwconfs.module';
import { GroupsPageModule }    from './groups/groups.module';
import { InformationsModule }    from './informations/informations.module';
import { MyGroupsPageModule }  from './mygroups/mygroups.module';
import { RoomsListsModule } from './rooms/lists/rooms-lists.module';
import { SecurityPageModule }  from './security/security.module';
import { SoftwaresPageModule } from './softwares/softwares.module';
import { SystemPageModule }    from './system/system.module';
import { ProfileModule }       from './profile/profile.module';
import { UsersListsPageModule } from './users/lists/users-lists.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CalendarModule,
    DevicesListsModule,
    HwconfsPageModule,
    GroupsPageModule,
    InformationsModule,
    MyGroupsPageModule,
    RoomsListsModule,
    SecurityPageModule,
    SoftwaresPageModule,
    SystemPageModule,
    UsersListsPageModule,
    ProfileModule
  ]
})
export class CranixModule { }
