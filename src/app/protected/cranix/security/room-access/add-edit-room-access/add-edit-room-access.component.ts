import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//own
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { AccessInRoom }  from 'src/app/shared/models/secutiry-model';
import { SecurityService } from 'src/app/services/security-service';
@Component({
  selector: 'cranix-add-edit-room-access',
  templateUrl: './add-edit-room-access.component.html',
})
export class AddEditRoomAccessComponent implements OnInit {
  result: any = {};
  objectType: string = "";
  roomAccess: AccessInRoom = null;
  objectKeys: string[] = [];
  objectActionTitle: string = "";
  objectAction: string = "";

  constructor(
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private navParams: NavParams,
    private modalController: ModalController,
    public securityService: SecurityService,
    public translateService: TranslateService,
    public toastController: ToastController
  ) {
    this.roomAccess = this.navParams.get('object');
    if (this.navParams.get('objectAction') == 'add') {
      this.objectActionTitle = "Add room access rule.";
      this.objectAction = "Create";
    } else {
      this.objectActionTitle = "Edit room access rule",
      this.objectAction = "modify";
    }
    this.objectKeys = Object.getOwnPropertyNames(this.roomAccess);
  }
  ngOnInit() {
  }

  closeWindow() {
    this.modalController.dismiss();
  }
  onSubmit(object) {
    console.log("onSubmit", object);
    this.securityService.addAccessInRoom(object);
    this.modalController.dismiss(object);
  }

  deleteObject() {
    this.securityService.deleteAccessInRoom(this.roomAccess.id);
    this.modalController.dismiss(this.roomAccess);
  }
}


