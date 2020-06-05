import { Component, OnInit } from '@angular/core';
import { RemoteRule } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Device, Room } from 'src/app/shared/models/data-model';
import { ModalController } from '@ionic/angular';
import { SecurityService } from 'src/app/services/security-service';

@Component({
  selector: 'cranix-add-remote-rule',
  templateUrl: './add-remote-rule.component.html',
  styleUrls: ['./add-remote-rule.component.scss'],
})
export class AddRemoteRuleComponent implements OnInit {

  rule: RemoteRule = new RemoteRule();
  deviceIps: any[] = [];
  constructor(
    public objectService: GenericObjectService,
    public securityService: SecurityService,
    public modalCtrl: ModalController
  ) {
    for (let dev of this.objectService.allObjects['device'].getValue()) {
      this.deviceIps.push({ key: dev.id, name: dev.name })
    }
  }

  ruleTypeChanged() { }
  ngOnInit() { }

  addRemoteRule(rule) {
    console.log(rule);
    let name = "";
      for (let obj of this.deviceIps) {
        if (obj.key == rule.id) {
          name = obj.name;
        }
      }
    this.securityService.remoteRules.push({
        ext: rule.ext,
        id: rule.id,
        name: name,
        port: rule.port
      });
    this.modalCtrl.dismiss('success');
  }
}
