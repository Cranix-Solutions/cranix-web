import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  fileToUpload: File = null;
  result: any = {};
  editForm: FormGroup;
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
    public formBuilder: FormBuilder,
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
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
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
    this.editForm.disable();
    this.splashScreen.show();
    console.log("onSubmit", object);
    if (this.objectType == 'setting') {
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
    return this.modalController.dismiss(object);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
  }
  defaultAcion(object) {
    let serverResponse: ServerResponse;
    let subs = this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      async (val) => {
        serverResponse = val;
        console.log(val);
        if (serverResponse.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          this.objectService.okMessage("Success:");
          this.modalController.dismiss("succes");
        } else {
          this.objectService.errorMessage("An error is accoured");
          this.editForm.enable();
          this.splashScreen.hide();
        }
      },
      async (error) => {
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.editForm.enable();
        this.splashScreen.hide();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
  deleteObject() {
    this.objectService.deleteObjectDialog(this.object,this.objectType);
    this.modalController.dismiss("succes");
  }
  supportRequest(object: SupportTicket) {
    let supportResponse: SupportTicket;
    let subs = this.systemService.createSupportRequest(object).subscribe(
      async (val) => {
        supportResponse = val;
        console.log(val);
        let message = this.languageS.trans(supportResponse.ticketResponseInfo);
        if (supportResponse.status == "OK") {
          message = message + " #"  + supportResponse.ticketno;
          this.objectService.okMessage(message);
          this.modalController.dismiss("succes");
        } else {
          this.objectService.errorMessage(message);
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
    this.formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.formData.append('role', object.role);
    this.formData.append('lang', object.lang);
    this.formData.append('identifier', object.identifier);
    this.formData.append('test', object.test.toString());
    this.formData.append('password', object.password);
    this.formData.append('mustChange', object.mustChange.toString());
    this.formData.append('full', object.full.toString());
    this.formData.append('allClasses', object.allClasses.toString());
    this.formData.append('cleanClassDirs', object.cleanClassDirs.toString());
    this.formData.append('resetPassword', object.resetPassword.toString());
    this.formData.append('appendBirthdayToPassword', object.appendBirthdayToPassword.toString());
    console.log(this.formData)
    console.log(object.test);
    console.log(object.password);
    console.log(this.formData.get("role"))
    let serverResponse: ServerResponse;
    let subs = this.usersService.importUsers(this.formData).subscribe(
      async (val) => {
        serverResponse = val;
        console.log(val);
        if (serverResponse.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          this.objectService.okMessage("Success:");
          this.modalController.dismiss("succes");
        } else {
          this.objectService.errorMessage("An error is accoured");
          this.editForm.enable();
          this.splashScreen.hide();
        }
      },
      async (error) => {
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.editForm.enable();
        this.splashScreen.hide();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
}


