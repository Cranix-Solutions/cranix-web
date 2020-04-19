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
        path: '',
        redirectTo: 'status'
      }
    ]
  },
  {
    path: 'softwares',
    redirectTo: 'status'
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
  declarations: [SoftwaresPage,SoftwareStatusComponent,SoftwarePackagesComponent,SoftwareSetsComponent]
})
export class SoftwaresPageModule { }
