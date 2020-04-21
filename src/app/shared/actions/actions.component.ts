import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { AlertController } from '@ionic/angular';
//Own stuff
import { userMenu, groupMenu, roomMenu, deviceMenu, instituteMenu } from './objects.menus';
import { OssActionMap, ServerResponse } from 'src/app/shared/models/server-models';
import { LanguageService } from 'src/app/services/language.service';
import { CephalixService } from 'src/app/services/cephalix.service';


@Component({
  selector: 'cranix-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {


  actionFunction: Function;
  actionMap: OssActionMap = new OssActionMap();
  objectIds: number[] = [];
  selection: any[]= [];
  columns: string[] = [];
  count: number = 0;
  objectType: string = '';
  menu: any[] = [];

  commonMenu: any[] = [{
    "name": "CSV Export",
    "icon": "download-outline",
    "action": "csv-export",
    "enabled": true
  }]

  commonLastMenu: any[] = [{
    "name": "Delete",
    "enabled": true,
    "icon": "trash",
    "action": "delete"
  }]

  constructor(
    public alertController: AlertController,
    private navParams: NavParams,
    private popoverController: PopoverController,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private cephalixService: CephalixService
    
  ) {
    this.objectType = this.navParams.get('objectType');
    this.objectIds     = this.navParams.get('objectIds');
    this.selection      = this.navParams.get('selection');
    if (this.objectIds) {
      this.count = this.objectIds.length;
    }
    if (this.objectType == "user") {
      this.menu = this.commonMenu.concat(userMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "group") {
      this.menu = this.commonMenu.concat(groupMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "room") {
      this.menu = this.commonMenu.concat(roomMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "device") {
      this.menu = this.commonMenu.concat(deviceMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "institute") {
      this.menu = this.commonMenu.concat(instituteMenu).concat(this.commonLastMenu);
      this.actionFunction = this.cephalixService.applyAction;
    } else if (this.objectType == "group") {
      this.menu = this.commonMenu.concat(groupMenu).concat(this.commonLastMenu);
    }
  }

  ngOnInit() {
    console.log("ActionsComponent" + this.objectIds);
  }

  closePopover() {
    this.popoverController.dismiss();
  }

 async messages(ev: string) {
    console.log(ev);
    switch (ev) {
      case 'csv-export': {
        let header: string[] = [];
        new AngularCsv(this.selection, this.objectType , { showLabels: true, headers: Object.getOwnPropertyNames(this.selection[0])});
        this.popoverController.dismiss();
        break;
      }
      default : {
        const alert = await this.alertController.create({
          header: this.languageService.trans(ev),
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Okay',
              handler: () => {
                this.executeAction(ev)
                console.log('Confirm Okay');
              }
            }
          ]
        });
        alert.onDidDismiss().then(() => this.popoverController.dismiss() );
        await alert.present();
        break;
      }
    }
  }

  executeAction(action: string){
    this.actionMap.name = action;
    this.actionMap.objectIds = this.objectIds;
    switch(this.objectType){
       case 'institute': {
        let sub = this.cephalixService.applyAction(this.actionMap).subscribe(
          (val) => { console.log('OK')},
          (err) => { console.log("ERR")},
          () => { sub.unsubscribe(); }
          )
       }
    }
    
  }
}

