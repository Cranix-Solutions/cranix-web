import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule }            from 'src/app/shared/cranix-shared.module';
import { SoftwaresPage }                 from './softwares.page';
import { SoftwareStatusComponent }       from './status/software-status.component';
import { InstallationSetsComponent }     from './sets/installation-sets.component';
import { SoftwarePackagesComponent }     from './packages/software-packages.component';
import { EditInstallationSetComponent }  from './edit-set/edit-installation-set.component';

const routes: Routes = [
  {
    path: 'softwares',
    component: SoftwaresPage,
    children: [
      {
        path: 'status',
        component: SoftwareStatusComponent
      },
      {
        path: 'packages',
        component:  SoftwarePackagesComponent
      },
      {
        path: 'sets',
       component: InstallationSetsComponent
      },
      {
        path: 'edit-set',
       component: EditInstallationSetComponent
      },
      {
        path: '',
        redirectTo: 'sets'
      }
    ]
  },
  {
    path: 'softwares',
    redirectTo: 'sets'
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
  declarations: [SoftwaresPage,SoftwareStatusComponent,SoftwarePackagesComponent,InstallationSetsComponent,EditInstallationSetComponent]
})
export class SoftwaresPageModule { }
