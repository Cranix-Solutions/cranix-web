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
import { UnboundComponent }              from './unbound/unbound.component';
import { FirewallCanDeactivate, ProxyCanDeactivate, UnboundCanDeactivate } from 'src/app/services/security-service';

const routes: Routes = [
  {
    path: 'security',
    component: SecurityPage,
    children: [
      {
        path: 'firewall',
        canDeactivate: [FirewallCanDeactivate],
        component: FirewallComponent
      },
      {
        path: 'proxy',
        canDeactivate: [ProxyCanDeactivate],
        component:  ProxyComponent
      },
      {
        path: 'unbound',
        canDeactivate: [UnboundCanDeactivate],
        component:  UnboundComponent
      },{
        path: 'access',
        component:  RoomAccessComponent
      },
      {
        path: '',
        redirectTo: 'access'
      }
    ]
  },
  {
    path: 'security',
    redirectTo: 'access'
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
  declarations: [SecurityPage,FirewallComponent,ProxyComponent,RoomAccessComponent,UnboundComponent]
})
export class SecurityPageModule { }
