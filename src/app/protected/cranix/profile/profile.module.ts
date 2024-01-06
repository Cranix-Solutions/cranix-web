import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanActivateViaAcls } from 'src/app/services/auth-guard.service';
import { IonicModule } from '@ionic/angular';
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { TranslateService } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipe-modules';
import { ProfileComponent } from './profile.component'
import { MyselfComponent } from './tabs/myself/myself.component'
import { MyDevicesComponent } from './tabs/my-devices/my-devices.component'
import { MyVPNComponent } from './tabs/my-vpn/my-vpn.component'
import { MyCrx2faComponent } from './tabs/my-crx2fa/my-crx2fa.component'
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
        path: 'crx2fa',
        component: MyCrx2faComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'myself', pathMatch: 'full'
      }
    ]
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
  declarations: [ProfileComponent,MyselfComponent,MyDevicesComponent,MyVPNComponent,MyCrx2faComponent],
  providers: [TranslateService, PipesModule,SelfManagementService,AdHocLanService]
})
export class ProfileModule { }
