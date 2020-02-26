import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { userMenu, groupMenu, roomMenu, deviceMenu, instituteMenu } from './objects.menus';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'cranix-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {

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
    
  ) {
    this.objectType = this.navParams.get('objectType');
    this.objectIds = this.navParams.get('objectIds');
    this.selection = this.navParams.get('selection');
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

 async messages(ev: String) {
    console.log(ev);
    switch (ev) {
      case 'csv-export': {
        let header: string[] = [];
        new AngularCsv(this.selection, this.objectType + ".csv", { showLabels: true, headers: Object.getOwnPropertyNames(this.selection[0])});
        this.popoverController.dismiss();
        break;
      }
      case 'wol' : {
        const alert = await this.alertController.create({
          header: 'WOL!',
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
}

