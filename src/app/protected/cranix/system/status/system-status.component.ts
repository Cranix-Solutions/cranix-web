import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
//Own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SystemService } from 'src/app/services/system.service';
import { LanguageService } from 'src/app/services/language.service';
import { SupportRequest } from 'src/app/shared/models/data-model';
import { ServiceStatus } from 'src/app/shared/models/server-models';
import { AuthenticationService } from 'src/app/services/auth.service';
import { CreateSupport } from 'src/app/shared/actions/create-support/create-support-page';

@Component({
  selector: 'cranix-system-status',
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss'],
})
export class SystemStatusComponent implements OnInit {

  mySupport = new SupportRequest();
  objectKeys: string[];
  systemStatus: any;
  servicesStatus: ServiceStatus[];
  header = {};
  chartsReady: boolean = false;
  series = [
    {
      type: 'pie',
      angleKey: 'count',
      legendItemKey: 'name'
    }
  ];

  constructor(
    public objectService: GenericObjectService,
    public languageService: LanguageService,
    public modalController: ModalController,
    public storage: Storage,
    public systemService: SystemService,
    public authService: AuthenticationService
  ) {
    this.systemService.initModule();
  }

  ngOnInit() {

    this.chartsReady = false;
    this.storage.get('System.Status.mySupport').then((val) => {
      let myTmp = JSON.parse(val);
      if (myTmp && myTmp.email) {
        this.mySupport = myTmp;
        this.mySupport['subject'] = "";
        this.mySupport['text'] = "";
      }
    });
    this.systemStatus = {};
    let subM = this.systemService.getStatus().subscribe({
      next: (val) => {
        console.log(val)
        this.systemStatus = {};
        this.objectKeys = Object.keys(val);
        for (let key of Object.keys(val)) {
          this.systemStatus[key] = {
            legend: { enabled: false },
            width: 250,
            height: 220,
            series: this.series,
            padding: {
              right: 40,
              left: 40
            }
          };
          if (key.startsWith("/dev")) {
            //Convert value into GB
            this.systemStatus[key]['data'] = []
            for (let a of val[key]) {
              this.systemStatus[key]['data'].push(
                {
                  name: a['name'],
                  count: parseInt(a['count']) / 1048576
                }
              )
            }
            this.header[key] = key + " [GB]"
          } else {
            this.systemStatus[key]['data'] = []
            for (let a of val[key]) {
              this.systemStatus[key]['data'].push(
                {
                  name: a['name'],
                  count: parseInt(a['count'])
                }
              )
            }
            this.header[key] = this.languageService.trans(key)
          }
        }
        this.chartsReady = true;
        console.log(this.systemStatus)
      },
      error: (err) => { console.log(err) },
      complete: () => { subM.unsubscribe() }
    })
  }


  update(ev: Event) {
    this.systemService.update()
  }

  restart(ev: Event) {
    this.systemService.restart()
  }
  shutDown(ev: Event) {
    this.systemService.shutDown()
  }

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
    const modal = await this.modalController.create({
      component: CreateSupport,
      cssClass: 'big-modal',
      componentProps: {
        support: this.mySupport,
      },
      animated: true,
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