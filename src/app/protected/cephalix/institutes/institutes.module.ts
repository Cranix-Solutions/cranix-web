import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService  } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { InstitutesPage } from './institutes.page';

const routes: Routes = [
  {
    path: 'institutes',
    component: InstitutesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    
    CranixSharedModule
  ],
  declarations: [InstitutesPage],
  providers: [TranslateService]
})
export class InstitutesPageModule {}
