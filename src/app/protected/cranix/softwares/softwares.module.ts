import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule }        from 'src/app/shared/cranix-shared.module';
import { SoftwaresPage }             from './softwares.page';
import { SoftwareStatusComponent }   from './status/software-status.component';
import { SoftwareSetsComponent }     from './sets/software-sets.component';
import { AddSoftwareSetComponent }     from './add-software-set/add-software-set.component';
import { SoftwarePackagesComponent } from './packages/software-packages.component';

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
       component: SoftwareSetsComponent
      },
      {
        path: 'add-set',
       component: AddSoftwareSetComponent
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
  declarations: [SoftwaresPage,SoftwareStatusComponent,SoftwarePackagesComponent,SoftwareSetsComponent,AddSoftwareSetComponent]
})
export class SoftwaresPageModule { }
