import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule }            from 'src/app/shared/cranix-shared.module';
import { SecurityPage }                  from './security.page';
import { FirewallComponent }             from './firewall/firewall.component';
import { ProxyComponent }                from './proxy/proxy.component';
import { RoomAccessComponent }           from './room-access/room-access.component';

const routes: Routes = [
  {
    path: 'security',
    component: SecurityPage,
    children: [
      {
        path: 'firewall',
        component: FirewallComponent
      },
      {
        path: 'proxy',
        component:  ProxyComponent
      },
      {
        path: 'room-access',
        component:  RoomAccessComponent
      },
      {
        path: '',
        redirectTo: 'firewall'
      }
    ]
  },
  {
    path: 'security',
    redirectTo: 'firewall'
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
  declarations: [SecurityPage,FirewallComponent,ProxyComponent,RoomAccessComponent]
})
export class SecurityPageModule { }
