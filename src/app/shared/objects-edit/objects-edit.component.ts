import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/* import { SplashScreen } from '@ionic-native/splash-screen/ngx'; */
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//own 
import { GenericObjectService } from '../../services/generic-object.service';
import { ServerResponse } from '../models/server-models';
@Component({
  selector: 'cranix-objects-edit',
  templateUrl: './objects-edit.component.html',
  styleUrls: ['./objects-edit.component.scss'],
})
export class ObjectsEditComponent implements OnInit {
  result: any = {};
  /**
   * This hash defines if a key  has defaults
   */
  hasDefaults: any = {};
  editForm: FormGroup;
  objectType: string = "";
  object: any = null;
  objectKeys: string[] = [];
  objectActionTitle: string = "";
  objectAction: string = "";

  readOnlyAttributes: string[] = [
    'fsQuotaUsed',
    'msQuotaUsed',
    'name',
    'recDate',
    'role',
    'uid'
  ]
  /**
   * Attributes which we get but need not be shown
   */
  hiddenAttributes: string[] = [
    'id',
    'ownerId',
    'deleted',
    'saveNext'
  ]
  required: any = {
    'givenName': '*',
    'groupType': '*',
    'instituteType': '*',
    'name': '*',
    'regCode': '*',
    'role': '*',
    'surName': '*'
  };

  constructor(
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService,
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
    this.editForm = this.formBuilder.group(this.convertObject());
  }

  compareFn(a: string, b: string): boolean {
    return a == b;
  }
  /**
   * Helper script fot the template to detect the type of the variables
   * @param val 
   */
  typeOf(key) {
    let obj = this.object[key];
    if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil') {
      let d = new Date()
      return "date";
    }
    if (typeof obj === 'boolean' && obj) {
      return "booleanTrue";
    }
    if (typeof obj === 'boolean') {
      return "booleanFalse";
    }
    if (this.hiddenAttributes.indexOf(key) != -1) {
      return "hidden";
    }
    if (this.objectAction == 'modify' && this.readOnlyAttributes.indexOf(key) != -1) {
      return "stringRO";
    }
    return "string";
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
            header: "Success:",
            message: serverResponse.value,
            color: "success",
            duration: 5000
          });
          (await toast).present();
          this.modalController.dismiss("succes");
        } else {

          const toast = this.toastController.create({
            position: "middle",
            header: "An Error was accoured:",
            message: serverResponse.value,
            color: "danger",
            duration: 6000
          });
          this.editForm.enable();
          this.splashScreen.hide();
          (await toast).present();
        }
      },
      async (error) => {
        const toast = this.toastController.create({
          position: "middle",
          message: "An Server Error is accoured",
          cssClass: "bar-assertive",
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

  convertObject() {
    //TODO introduce checks
    let output: any = {};
    for (let key in this.object) {
      if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil') {
        let date = new Date(this.object[key]);
        output[key] = date.toJSON();
      } else if (this.required[key]) {
        output[key] = [this.object[key], Validators.compose([Validators.required])];
      } else {
        output[key] = this.object[key];
      }
    }
    console.log(output);
    return output;
  }
}


