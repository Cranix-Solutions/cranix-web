import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { InstituteDetailsPage } from './institute-details.page';
import { InstituteEditComponent } from './edit/institute-edit.component';
import { InstituteNoticesComponent } from './notices/institute-notices.component';
import { InstituteStatusComponent } from './status/institute-status.component';
import { InstituteSyncedObjectsComponent } from './synced-objects/institute-synced-objects.component';

const routes: Routes = [
  {
    path: '',
    component: InstituteDetailsPage,
    children: [
      {
        path: 'all',
        redirectTo: '/pages/cephalix/institutes/all'
      },
      {
        path: 'edit',
        component:  InstituteEditComponent
      },
      {
        path: 'status',
        component: InstituteStatusComponent
      },
      {
        path: 'notices',
        component: InstituteNoticesComponent
      },
      {
        path: 'synced-objects',
       component: InstituteSyncedObjectsComponent
      },
      {
        path: '',
        redirectTo: 'edit'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'edit'
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
  declarations: [InstituteDetailsPage,InstituteEditComponent,InstituteStatusComponent,InstituteNoticesComponent,InstituteSyncedObjectsComponent]
})
export class InstituteDetailsPageModule { }
