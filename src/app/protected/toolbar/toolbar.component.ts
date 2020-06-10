import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//Own module
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { Settings } from 'src/app/shared/models/data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  roomName: string = "";
  commonName: string = "";
  instituteName: string = "";
  constructor(
    public authService: AuthenticationService,
    public alertController: AlertController,
    public storage: Storage,
    public translateService: LanguageService,
    public objectService: GenericObjectService,
    public modalConroller: ModalController
  ) {
    this.commonName = authService.session.commonName;
    this.roomName        = authService.session.roomName;
    this.instituteName  = authService.session.instituteName;
  }

  ngOnInit() { 
  }

  async logOut(ev: Event) {
    const alert = await this.alertController.create({
      header:  this.translateService.trans('Confirm!'),
      message: this.translateService.trans('Do you realy want to logout?'),
      buttons: [
        {
          text: this.translateService.trans('Cancel'),
          role: 'cancel',
        }, {
          text: 'OK',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  async retirectToSettings(ev: Event) {
      let settings  =  this.authService.settings;
      settings.lang = this.translateService.language.toUpperCase();
      const modal = await this.modalConroller.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "settings",
          objectAction: "modify",
          object:  settings
        },
        animated: true,
        swipeToClose: true,
        showBackdrop: true
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned.data) {
          this.authService.settings = dataReturned.data;
          this.storage.set("myCranixSettings",JSON.stringify(dataReturned.data));
          this.translateService.setLanguage( dataReturned.data.lang );
          console.log("Object was created or modified", dataReturned.data)
        }
      });
      (await modal).present();
    }

  closeWindow() {}
}
