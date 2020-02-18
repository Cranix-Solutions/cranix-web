import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsPageModule } from './groups/groups.module';
import { UsersPageModule } from './users/users.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GroupsPageModule,
    UsersPageModule
  ]
})
export class CranixModule { }
