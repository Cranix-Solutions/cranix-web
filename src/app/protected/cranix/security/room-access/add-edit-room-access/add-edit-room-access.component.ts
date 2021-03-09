import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
//own
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SecurityService } from 'src/app/services/security-service';
@Component({
  selector: 'cranix-add-edit-room-access',
  templateUrl: './add-edit-room-access.component.html',
})
export class AddEditRoomAccessComponent implements OnInit {
  result: any = {};
  objectKeys: string[] = [];
  objectActionTitle: string = "";

  @Input() roomAccess;
  @Input() objectAction;
  constructor(
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private modalController: ModalController,
    public securityService: SecurityService,
    public translateService: TranslateService,
    public toastController: ToastController
  ) {
  }
  ngOnInit() {
    if (this.objectAction == 'add') {
      this.objectActionTitle = "Add room access rule.";
    } else {
      this.objectActionTitle = "Edit room access rule.";
    }
    this.objectKeys = Object.getOwnPropertyNames(this.roomAccess);
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


