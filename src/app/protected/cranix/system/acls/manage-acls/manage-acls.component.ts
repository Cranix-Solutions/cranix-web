import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { SystemService } from 'src/app/services/system.service';
import { Acl } from 'src/app/shared/models/server-models';

@Component({
  selector: 'cranix-manage-acls',
  templateUrl: './manage-acls.component.html',
  styleUrls: ['./manage-acls.component.scss'],
})
export class ManageAclsComponent implements OnInit {

  name = "";
  objectType;
  object;
  availabeAcls = [];
  acls = [];

  constructor(
    private navParams: NavParams,
    public  modalController: ModalController,
    private systemService: SystemService
  ) { }

  ngOnInit() {
    this.objectType = this.navParams.get('objectType');
    this.object = this.navParams.get('object');
    if (this.objectType == 'group') {
      this.name = this.object.description;
    } else {
      this.name = this.object.uid + ' ( ' + this.object.givenName + ' ' + this.object.surName + ')'
    }
    this.readAcls();
  }

  readAcls() {
    this.acls = []
    this.availabeAcls = []
    let sub1 = this.systemService.getAclsOfObject(this.objectType, this.object.id).subscribe(
      (val) => {
        this.acls = val
        this.acls.sort((a, b) => (a.acl > b.acl) ? 1 : (b.acl > a.acl) ? -1 : 0)
      },
      (err) => { console.log(err) },
      () => { sub1.unsubscribe() }
    )
    let sub2 = this.systemService.getAvailableAclsOfObject(this.objectType, this.object.id).subscribe(
      (val) => {
        this.availabeAcls = val
        this.availabeAcls.sort((a, b) => (a.acl > b.acl) ? 1 : (b.acl > a.acl) ? -1 : 0)
      },
      (err) => { console.log(err) },
      () => { sub2.unsubscribe() }
    )
  }

  removeAcl(acl: Acl) {
    acl.allowed = false;
    this.setAcl(acl);
  }

  addAcl(acl: Acl) {
    acl.allowed = true;
    this.setAcl(acl);
  }

  setAcl(acl: Acl) {
    let sub2 = this.systemService.setAclOfObject(this.objectType, this.object.id, acl).subscribe(
      (val) => {
        console.log(val)
        this.readAcls()
      },
      (err) => { console.log(err) },
      () => { sub2.unsubscribe() }
    )
  }
}
