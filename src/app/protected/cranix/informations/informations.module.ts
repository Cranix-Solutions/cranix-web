import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { InformationsComponent, AddInfoPage } from 'src/app/protected/cranix/informations/informations.component'
import { QuillModule } from 'ngx-quill';
 
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
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [InformationsComponent, AddInfoPage ],
  providers: [TranslateService]
})
export class InformationsModule { }
