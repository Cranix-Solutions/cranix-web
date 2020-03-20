import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
/* import { SplashScreen } from '@ionic-native/splash-screen/ngx'; */
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//own 
import { GenericObjectService } from '../../services/generic-object.service';
import { LanguageService } from '../../services/language.service';
import { ServerResponse } from '../models/server-models';
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
    this.objectKeys = Object.getOwnPropertyNames(this.object);
    console.log(this.objectKeys);
    console.log(this.object);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }

  closeWindow() {
    this.modalController.dismiss();
  }

  onSubmit(object) {
    this.editForm.disable();
    let serverResponse: ServerResponse;
    this.splashScreen.show();
    console.log("onSubmit", object);
    let subs = this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      async (val) => {
        serverResponse = val;
        console.log(val);
        if (serverResponse.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          const toast = this.toastController.create({
            position: "middle",
            header:  this.languageS.trans("Success:"),
            message: serverResponse.value,
            color: "success",
            duration: 5000
          });
          (await toast).present();
          this.modalController.dismiss("succes");
        } else {
          const toast = this.toastController.create({
            position: "middle",
            header:  this.languageS.trans("An Error was accoured:"),
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


