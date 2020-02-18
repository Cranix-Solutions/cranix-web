import { NgModule, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { GroupsPage } from './groups.page';
import { GroupsService } from 'src/app/services/groups.service';

const routes: Routes = [
  {
    path: 'groups',
    component: GroupsPage
  }
];

@NgModule({
  imports: [
    CranixSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GroupsPage],
  providers:[GroupsService]
})
export class GroupsPageModule {}
