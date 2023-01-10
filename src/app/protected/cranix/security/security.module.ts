import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

//own modules
import { CranixSharedModule } from 'src/app/shared/cranix-shared.module';
import { SecurityPage } from './security.page';
import { FirewallComponent } from './firewall/firewall.component';
import { ProxyComponent } from './proxy/proxy.component';
import { RoomAccessComponent } from './room-access/room-access.component';
import { UnboundComponent } from './unbound/unbound.component';
import { FirewallCanDeactivate, ProxyCanDeactivate, UnboundCanDeactivate } from 'src/app/services/security-service';
import { AddRemoteRuleComponent } from './firewall/add-rules/add-remote-rule.component';
import { AddOutgoingRuleComponent } from './firewall/add-rules/add-outgoing-rule.component';
import { AddEditRoomAccessComponent } from './room-access/add-edit-room-access/add-edit-room-access.component';
import { AccessLogComponent } from './access-log/access-log.component';

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
        component: ProxyComponent
      },
      {
        path: 'unbound',
        canDeactivate: [UnboundCanDeactivate],
        component: UnboundComponent
      }, {
        path: 'access',
        component: RoomAccessComponent
      }, {
        path: 'access-log',
        component: AccessLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    CranixSharedModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AccessLogComponent,
    SecurityPage,
    FirewallComponent,
    ProxyComponent,
    RoomAccessComponent,
    UnboundComponent,
    AddRemoteRuleComponent,
    AddOutgoingRuleComponent,
    AddEditRoomAccessComponent],
  providers: [FirewallCanDeactivate, ProxyCanDeactivate, UnboundCanDeactivate]
})
export class SecurityPageModule { }
