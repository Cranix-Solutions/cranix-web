import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { InstitutesListsPage } from './institutes-lists.page';
import { InstitutesComponent } from './institutes.component';
import { InstitutesStatusComponent } from './institutes-status.component';
import { InstitutesSyncObjectsComponent } from './institutes-sync-objects.component';
import { InstitutesManage } from './institutes.manage';

const routes: Routes = [
  {
    path: '',
    component: InstitutesListsPage,
    children: [
      {
        path: 'all',
        component:  InstitutesComponent
      },
      {
        path: 'status',
        component: InstitutesStatusComponent
      },
      {
        path: 'sync',
        component: InstitutesSyncObjectsComponent
      },
      {
        path: 'manage',
        component: InstitutesManage
      },
      {
        path: '', pathMatch: 'full',
        redirectTo: 'all'
      }
    ]
  },
  {
    path: '', pathMatch: 'full',
    redirectTo: 'all'
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
  declarations: [InstitutesListsPage,InstitutesComponent,InstitutesStatusComponent,InstitutesSyncObjectsComponent,InstitutesManage]
})
export class InstitutesListsPageModule { }

