import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//own
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { UsersService } from 'src/app/services/users.service';
import { SystemService } from 'src/app/services/system.service';
import { SupportTicket } from '../models/data-model';
@Component({
  selector: 'cranix-objects-edit',
  templateUrl: './objects-edit.component.html',
  styleUrls: ['./objects-edit.component.scss'],
})
export class ObjectsEditComponent implements OnInit {
  formData: FormData = new FormData();
  disabled: boolean  = false;
  fileToUpload: File = null;
  result: any = {};
  objectType: string = "";
  object: any = null;
  objectKeys: string[] = [];
  objectActionTitle: string = "";
  objectAction: string = "";
  pickerOptions = {
    keyboardClose: false
  }

  constructor(
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private navParams: NavParams,
    private modalController: ModalController,
    private splashScreen: SpinnerDialog,
    private usersService: UsersService,
    private systemService: SystemService,
    public translateService: TranslateService,
    public toastController: ToastController
  ) {
    this.objectType = this.navParams.get('objectType');
    //this.object = this.objectService.convertObject(this.navParams.get('object'));
    this.object = this.navParams.get('object');
    if (this.navParams.get('objectAction') == 'add') {
      this.objectActionTitle = "Add " + this.objectType;
      this.objectAction = "Create";
    } else {
      this.objectActionTitle = "Edit " + this.objectType;
      this.objectAction = "Apply";
    }
    this.objectKeys = this.navParams.get('objectKeys');
    if (!this.objectKeys) {
      this.objectKeys = Object.getOwnPropertyNames(this.object);
    }
    console.log(this.objectKeys);
    console.log(this.object);
  }
  ngOnInit() {
    this.disabled = false;
  }

  closeWindow() {
    this.modalController.dismiss();
  }

  setNextDefaults() {
    let subs = this.cephalixService.getNextDefaults().subscribe(
      (val) => {
        for (let key of this.objectKeys) {
          if (!this.object[key] && val[key]) {
            this.object[key] = val[key];
          }
        }
        this.ngOnInit();
      },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }

  onSubmit(object) {
    if( this.disabled ) {
      return;
    }
    this.disabled = true;
    this.splashScreen.show();
    this.objectService.requestSent();
    console.log("onSubmit", object);
    if (this.objectType == 'settings') {
      return this.modalController.dismiss(object);
    }
    switch (this.objectType) {
      case 'userImport': {
        this.userImport(object);
        break;
      }
      case 'support': {
        object['description'] = object.text;
        delete object.text;
        this.supportRequest(object);
        break;
      }
      default: {
        this.defaultAcion(object);
      }
    }
    //return this.modalController.dismiss(object);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
  }
  defaultAcion(object) {
    let serverResponse: ServerResponse;
    let subs = this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      async (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
          this.splashScreen.hide();
        }
      },
      async (error) => {
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.disabled = false;
        this.splashScreen.hide();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
  deleteObject() {
    this.objectService.deleteObjectDialog(this.object,this.objectType);
    //this.modalController.dismiss("succes");
  }
  supportRequest(object: SupportTicket) {
    let subs = this.systemService.createSupportRequest(object).subscribe(
      async (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
          this.splashScreen.hide();
        }
      },
      async (error) => {
        this.objectService.errorMessage("A Server Error is accoured:"+ error.toString());
        this.splashScreen.hide();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
  userImport(object) {
    let formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    formData.append('role', object.role);
    formData.append('lang', object.lang);
    formData.append('identifier', object.identifier);
    formData.append('test', object.test ? "true":"false");
    formData.append('password', object.password);
    formData.append('mustChange', object.mustChange ? "true":"false");
    formData.append('full', object.full ? "true":"false");
    formData.append('allClasses', object.allClasses ? "true":"false");
    formData.append('cleanClassDirs', object.cleanClassDirs ? "true":"false");
    formData.append('resetPassword', object.resetPassword ? "true":"false");
    formData.append('appendBirthdayToPassword', object.appendBirthdayToPassword ? "true":"false");
    formData.append('appendClassToPassword', object.appendClassToPassword ? "true":"false");
    console.log(object.test);
    console.log(object.password);
    console.log(this.formData.get("role"))
    let subs = this.usersService.importUsers(formData).subscribe(
      async (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
          this.splashScreen.hide();
        }
      },
      async (error) => {
        console.log(error)
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.disabled = false;
        this.splashScreen.hide();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
}


