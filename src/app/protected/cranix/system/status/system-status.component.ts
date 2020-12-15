import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//Own stuff
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SystemService } from 'src/app/services/system.service';
import { LanguageService } from 'src/app/services/language.service';
import { SupportTicket } from 'src/app/shared/models/data-model';
import { ServiceStatus } from 'src/app/shared/models/server-models';

@Component({
  selector: 'cranix-system-status',
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss'],
})
export class SystemStatusComponent implements OnInit {

  mySupport = new SupportTicket();
  objectKeys: string[];
  systemStatus: any;
  servicesStatus: ServiceStatus[];
  series = [
    {
      type: 'pie',
      angleKey: 'count',
      labelKey: 'name'
    }
  ];
  options;

  constructor(
    public genericObject: GenericObjectService,
    public languageService: LanguageService,
    public modalCtrl: ModalController,
    public storage: Storage,
    public systemService: SystemService
  ) {
    this.systemService.initModule();
  }

  ngOnInit() {
    this.storage.get('System.Status.mySupport').then((val) => {
      console.log(val)
      let myTmp = JSON.parse(val);
      console.log(myTmp);
      if(myTmp && myTmp.email) {
          this.mySupport = myTmp;
          this.mySupport['subject'] = "";
          this.mySupport['text'] = "";
      }
    });
    this.systemStatus = {};
    let subM = this.systemService.getStatus().subscribe(
      (val) => {
        this.systemStatus = {};
        this.objectKeys = Object.keys(val).sort();
        for (let key of Object.keys(val)) {
          this.systemStatus[key] = {
            legend: { enabled: false },
            title: { text: this.languageService.trans(key) },
            autoSize: false,
            width: 250,
            height: 220
          };
          this.systemStatus[key]['series'] = this.series;
          this.systemStatus[key]['data'] = val[key];
        }
        console.log(this.systemStatus);
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }


  update(ev: Event) {
    let subM = this.systemService.update().subscribe(
      (val) => {
        console.log(this.systemStatus);
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
  }
  restart(ev: Event) { }
  shutDown(ev: Event) { }

  async support(ev: Event) {
    delete this.mySupport.description;
    delete this.mySupport.regcode;
    delete this.mySupport.product;
    delete this.mySupport.company;
    delete this.mySupport.regcodeValidUntil;
    delete this.mySupport.status;
    delete this.mySupport.requestDate;
    delete this.mySupport.ticketno;
    delete this.mySupport.ticketResponseInfo;
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "support",
        objectAction: 'add',
        object: this.mySupport,
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        delete dataReturned.data.subject;
        delete dataReturned.data.text;
        console.log("Object was created or modified", dataReturned.data);
        this.storage.set('System.Status.mySupport', JSON.stringify(dataReturned.data));
      }
    });
    (await modal).present();
  }
}
