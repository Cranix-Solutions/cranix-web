import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { CustomersPage } from './customers.page';
import { PipesModule } from '../../../pipes/pipe-modules';

const routes: Routes = [
  {
    path: 'customers',
    component: CustomersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CranixSharedModule
  ],
  declarations: [CustomersPage],
   providers: [TranslateService,PipesModule]
})
export class CustomersPageModule {}
