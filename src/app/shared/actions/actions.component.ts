import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { userMenu, groupMenu, roomMenu, deviceMenu, instituteMenu } from './objects.menus';

@Component({
  selector: 'cranix-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {

  objectIds: number[] = [];
  count: number = 0;
  objectType: string = '';
  menu: any[] = [];
  
  commonMenu: any[] = [{
    "name": "CSV Export",
    "icon": "download-outline",
    "enabled": true
  }]

  commonLastMenu: any[] = [{
    "name": "Delete",
    "enabled": true,
    "icon": "trash",
    "action": "delete"
  }]


  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    public translateService: TranslateService,
  ) {
    this.objectType = this.navParams.get('objectType');
    this.objectIds = this.navParams.get('objectIds');
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
  console.log("ActionsComponent"  + this.objectIds);
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  messages(ev: String) {
    console.log(ev);
  }
}
