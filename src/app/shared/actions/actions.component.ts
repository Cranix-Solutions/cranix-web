import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { AlertController } from '@ionic/angular';
//Own stuff
import { userMenu, groupMenu, roomMenu, deviceMenu, instituteMenu, hwconfMenu, ticketMenu, printerMenu, studentMenu, eduRoomMenu } from './objects.menus';
import { CrxActionMap, ServerResponse } from 'src/app/shared/models/server-models';
import { LanguageService } from 'src/app/services/language.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { FilesUploadComponent } from './files-upload/files-upload.component';
import { FilesCollectComponent } from './files-collect/files-collect.component';


@Component({
  selector: 'cranix-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  objectIds: number[] = [];
  selection: any[] = [];
  columns: string[] = [];
  count: number = 0;
  objectType: string = '';
  menu: any[] = [];

  commonMenu: any[] = [{
    "name": "CSV Export",
    "icon": "download-outline",
    "action": "csv-export",
    "color": "secondary",
    "enabled": true
  }]

  commonLastMenu: any[] = [{
    "name": "Delete",
    "enabled": true,
    "icon": "trash",
    "color": "danger",
    "action": "delete"
  }]

  token: string;
  hostname: string;
  headers: HttpHeaders;

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private navParams: NavParams,
    private popoverController: PopoverController,
    public translateService: TranslateService,
    private languageService: LanguageService,
    public objectService: GenericObjectService,
    private http: HttpClient,
    private utilsS: UtilsService,
    private authS: AuthenticationService) {
    this.hostname = this.utilsS.hostName();
    this.token = this.authS.getToken();
    this.headers = new HttpHeaders({
      'Content-Type': "application/json",
      'Accept': "application/json",
      'Authorization': "Bearer " + this.token
    });
  }

  ngOnInit() {
    console.log("ActionsComponent")
    console.log(this.navParams);
    this.objectType = this.navParams.get('objectType');
    this.objectIds = this.navParams.get('objectIds');
    this.selection = this.navParams.get('selection');
    if (this.objectIds) {
      this.count = this.objectIds.length;
    } else {
      this.count = this.selection.length;
    }
    if (this.objectType == "user") {
      this.menu = this.commonMenu.concat(userMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "education/user" || this.objectType == "education/group") {
      this.menu = this.commonMenu.concat(studentMenu);
    } else if (this.objectType == "group") {
      this.menu = this.commonMenu.concat(groupMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "room") {
      this.menu = this.commonMenu.concat(roomMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "device") {
      this.menu = this.commonMenu.concat(deviceMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "institute") {
      this.menu = this.commonMenu.concat(instituteMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "ticket") {
      this.menu = this.commonMenu.concat(ticketMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "group") {
      this.menu = this.commonMenu.concat(groupMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "hwconf") {
      this.menu = this.commonMenu.concat(hwconfMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "printer") {
      this.menu = this.commonMenu.concat(printerMenu).concat(this.commonLastMenu);
    } else if (this.objectType == "education/room" || this.objectType == "education/device") {
      this.menu = eduRoomMenu;
    }
    console.log(this.menu);
  }

  adaptMenu() {
    //TODO
    for (let m of this.menu) {

    }
  }
  closePopover() {
    this.popoverController.dismiss();
  }

  async messages(ev: string) {
    console.log(ev);
    let actionMap = new CrxActionMap;
    actionMap.name = ev;
    actionMap.objectIds = this.objectIds;
    switch (ev) {
      case 'csv-export': {
        let header: string[] = [];
        new AngularCsv(this.selection, this.objectType, { showLabels: true, headers: Object.getOwnPropertyNames(this.selection[0]) });
        this.popoverController.dismiss();
        break;
      }
      case 'upload': {
        this.popoverController.dismiss();
        const modal = await this.modalController.create({
          component: FilesUploadComponent,
          cssClass: 'small-modal',
          animated: true,
          swipeToClose: true,
          showBackdrop: true,
          componentProps: {
            objectType: this.objectType,
            actionMap: actionMap
          }
        });
        (await modal).present();
        break;
      }
      case 'collect': {
        this.popoverController.dismiss();
        const modal = await this.modalController.create({
          component: FilesCollectComponent,
          cssClass: 'small-modal',
          animated: true,
          swipeToClose: true,
          showBackdrop: true,
          componentProps: {
            objectType: this.objectType,
            actionMap: actionMap
          }
        });
        (await modal).present();
        break;
      }
      case 'setPassword': {
        this.popoverController.dismiss();
        const modal = await this.modalController.create({
          component: SetpasswordComponent,
          cssClass: 'small-modal',
          animated: true,
          swipeToClose: true,
          showBackdrop: true
        });
        modal.onDidDismiss().then((dataReturned) => {
          this.authS.log(dataReturned.data)
          if (dataReturned.data) {
            actionMap.stringValue = dataReturned.data.password;
            actionMap.booleanValue = dataReturned.data.mustChnage;
            this.executeAction(actionMap);
          }
        });
        (await modal).present();
        break;
      }
      default: {
        const alert = await this.alertController.create({
          header: this.languageService.trans(ev),
          buttons: [
            {
              text: this.languageService.trans('Cancel'),
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: this.languageService.trans('OK'),
              handler: () => {
                this.executeAction(actionMap);
                console.log('Confirm Okay');
              }
            }
          ]
        });
        alert.onDidDismiss().then(() => this.popoverController.dismiss());
        await alert.present();
        break;
      }
    }
  }

  executeAction(actionMap: CrxActionMap) {
    this.objectService.requestSent();
    let url = this.hostname + "/" + this.objectType + "s/applyAction"
    console.log("Execute Action")
    console.log(url)
    console.log(actionMap)
    let sub = this.http.post<ServerResponse[]>(url, actionMap, { headers: this.headers }).subscribe(
      (val) => {
        let response = this.languageService.trans("List of the results:");
        for (let resp of val) {
          response = response + "<br>" + this.languageService.transResponse(resp);
        }
        if (actionMap.name == 'delete') {
          this.objectService.getAllObject(this.objectType);
        }
        this.objectService.okMessage(response)
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe(); }
    )
  }

}

