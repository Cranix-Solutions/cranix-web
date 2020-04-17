import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//own 
import { CephalixService }      from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService }      from 'src/app/services/language.service';
import { ServerResponse }       from 'src/app/shared/models/server-models';
@Component({
  selector: 'cranix-objects-edit',
  templateUrl: './objects-edit.component.html',
  styleUrls: ['./objects-edit.component.scss'],
})
export class ObjectsEditComponent implements OnInit {
  result: any = {};
  editForm: FormGroup;
  objectType: string = "";
  object: any = null;
  objectKeys: string[] = [];
  objectActionTitle: string = "";
  objectAction: string = "";

  constructor(
    public cephalixService: CephalixService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private navParams: NavParams,
    private modalController: ModalController,
    private splashScreen: SpinnerDialog,
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
    let serverResponse: ServerResponse;
    this.splashScreen.show();
    console.log("onSubmit", object);
    if(this.objectType == 'setting' ) {
      return  this.modalController.dismiss(object);
    }
    let subs = this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      async (val) => {
        serverResponse = val;
        console.log(val);
        if (serverResponse.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("Success:"),
            message: serverResponse.value,
            color: "success",
            duration: 5000
          });
          (await toast).present();
          this.modalController.dismiss("succes");
        } else {
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("An Error was accoured:"),
            message: serverResponse.value,
            color: "warning",
            duration: 6000
          });
          this.editForm.enable();
          this.splashScreen.hide();
          (await toast).present();
        }
      },
      async (error) => {
        console.log(error);
        const toast = this.toastController.create({
          position: "middle",
          message: "A Server Error is accoured:" + error,
          color: "danger",
          duration: 3000
        });
        this.editForm.enable();
        this.splashScreen.hide();
        (await toast).present();
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
}


