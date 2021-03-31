import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { IonicModule } from '@ionic/angular';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService } from '@ngx-translate/core';
import { InformationsComponent, AddEditInfoPage, ShowResponses } from 'src/app/protected/cranix/informations/informations.component'
import { QuillModule } from 'ngx-quill';
import { mathToolbarOptions } from 'src/app/shared/models/constants';
 
const routes: Routes = [
  {
    path: 'informations',
    canActivate: [CanActivateViaAcls],
    component: InformationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    IonicModule,
    QuillModule.forRoot({
      modules: { toolbar: mathToolbarOptions},
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [InformationsComponent, AddEditInfoPage,  ShowResponses],
  providers: [TranslateService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InformationsModule { }
