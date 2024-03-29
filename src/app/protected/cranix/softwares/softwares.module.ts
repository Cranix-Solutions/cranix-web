import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule }            from 'src/app/shared/cranix-shared.module';
import { EditInstallationSetComponent }  from './edit-set/edit-installation-set.component';
import { InstallationSetsComponent }     from './sets/installation-sets.component';
import { SoftwaresPage }                 from './softwares.page';
import { SoftwareStatusComponent }       from './status/software-status.component';
import { SoftwarePackagesComponent }     from './packages/software-packages.component';
import { SoftwareLicensesComponent }     from 'src/app/shared/actions/software-licenses/software-licenses.component'

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
        path: '', pathMatch: 'full', 
        redirectTo: 'sets'
      }
    ]
  },
  {
    path: 'softwares', pathMatch: 'full', 
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
  declarations: [
    EditInstallationSetComponent,
    InstallationSetsComponent,
    SoftwareLicensesComponent,
    SoftwaresPage,
    SoftwarePackagesComponent,
    SoftwareStatusComponent,
    SoftwarePackagesComponent]
})
export class SoftwaresPageModule { }
