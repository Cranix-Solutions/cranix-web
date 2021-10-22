import { Component, OnInit } from '@angular/core';
import { OutgoingRule } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ModalController } from '@ionic/angular';
import { SecurityService } from 'src/app/services/security-service';

class SourceObject {
  public key:  number;
  public name: string;
}
@Component({
  selector: 'cranix-add-outgoing-rule',
  templateUrl: './add-outgoing-rule.component.html',
  styleUrls: ['./add-outgoing-rule.component.scss'],
})
export class AddOutgoingRuleComponent implements OnInit {

  rule: OutgoingRule = new OutgoingRule();
  roomIps:        SourceObject[] = [];
  deviceIps:      SourceObject[] = [];
  selectedSource: SourceObject;
  constructor(
    public objectService: GenericObjectService,
    public securityService: SecurityService,
    public modalCtrl: ModalController
  ) {
    for (let room of this.securityService.firewallRooms) {
      this.roomIps.push({ key: room.id, name: room.name })
    }
    for (let dev of this.objectService.allObjects['device']) {
      this.deviceIps.push({ key: dev.id, name: dev.name })
    }
  }

  ruleTypeChanged() { }
  ngOnInit() { }

  addOutRule(rule) {
    console.log(rule);
    console.log(this.selectedSource);
    rule.id= this.selectedSource.key;
    let name = this.selectedSource.name;
    this.securityService.addOutgoingRule({
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
