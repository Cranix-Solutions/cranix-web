import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { ProfileComponent } from 'src/app/protected/cranix/profile/profile.component'
import { MyselfComponent } from 'src/app/protected/cranix/profile/tabs/myself/myself.component'
import { MyDevicesComponent } from 'src/app/protected/cranix/profile/tabs/my-devices/my-devices.component'
import { MyVPNComponent } from 'src/app/protected/cranix/profile/tabs/my-vpn/my-vpn.component'
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { AdHocLanService } from 'src/app/services/adhoclan.service';

const routes: Routes = [
  {
    path: 'profile',
    canActivate: [CanActivateViaAcls],
    component: ProfileComponent,
    children: [
      {
        path: 'myself',
        component: MyselfComponent
      },
      {
        path: 'mydevice',
        component: MyDevicesComponent
      },
      {
        path: 'myVPN',
        component: MyVPNComponent
      },{
        path: '',
        redirectTo: 'myself'
      }
    ]
    //loadChildren: () => import('./lessons.module').then( m => m.LessonsModule)
  },
  {
    path: 'profile',
    redirectTo: 'myself'
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
  declarations: [ProfileComponent,MyselfComponent,MyDevicesComponent,MyVPNComponent],
  providers: [TranslateService, PipesModule,SelfManagementService,AdHocLanService]
})
export class ProfileModule { }
