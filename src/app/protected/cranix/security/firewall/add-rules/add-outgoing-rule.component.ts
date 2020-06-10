import { Component, OnInit } from '@angular/core';
import { OutgoingRule } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Device, Room } from 'src/app/shared/models/data-model';
import { ModalController } from '@ionic/angular';
import { SecurityService } from 'src/app/services/security-service';

@Component({
  selector: 'cranix-add-outgoing-rule',
  templateUrl: './add-outgoing-rule.component.html',
  styleUrls: ['./add-outgoing-rule.component.scss'],
})
export class AddOutgoingRuleComponent implements OnInit {

  rule: OutgoingRule = new OutgoingRule();
  roomIps: any[] = [];
  deviceIps: any[] = [];
  constructor(
    public objectService: GenericObjectService,
    public securityService: SecurityService,
    public modalCtrl: ModalController
  ) {
    let counter = 0;
    for (let ip of this.objectService.selects['network']) {
      this.roomIps.push({ key: counter, name: ip });
      counter--;
    }
    for (let room of this.objectService.allObjects['room'].getValue()) {
      this.roomIps.push({ key: room.id, name: room.name })
    }
    for (let dev of this.objectService.allObjects['device'].getValue()) {
      this.deviceIps.push({ key: dev.id, name: dev.name })
    }
  }

  ruleTypeChanged() { }
  ngOnInit() { }

  addOutRule(rule) {
    console.log(rule);
    let name = "";
    if (rule.type == 'device') {
      for (let obj of this.deviceIps) {
        if (obj.key == rule.id) {
          name = obj.name;
        }
      }
    } else {
      for (let obj of this.roomIps) {
        if (obj.key == rule.id) {
          name = obj.name;
        }
      }
    }
    this.securityService.outgoingRules.push({
        prot: rule.prot,
        port: rule.port,
        name: name,
        id: rule.id,
        type: rule.type,
        dest: rule.dest
      });
    this.modalCtrl.dismiss('success');
  }
}
