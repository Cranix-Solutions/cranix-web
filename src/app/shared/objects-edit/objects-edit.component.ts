import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//own 
import { GenericObjectService } from '../../services/generic-object.service';
import { User, Group, Room, Device, HWConfig, UserC } from '../models/data-model';
import { Institute, Customer } from '../models/cephalix-data-model';
import { async } from 'rxjs/internal/scheduler/async';
import { ServerResponse } from '../models/server-models';
@Component({
  selector: 'cranix-objects-edit',
  templateUrl: './objects-edit.component.html',
  styleUrls: ['./objects-edit.component.scss'],
})
export class ObjectsEditComponent implements OnInit {

  result: any = {};
  /**
   * This hash will contains the default values for some enumerated values like role, network ...
   */
  defaults: any = {
    'role': ['teachers', 'students', 'sysadmins']
  }
    ;
  /**
   * This hash defines if a key  has defaults
   */
  hasDefaults: any = {};
  editForm: FormGroup;
  objectType: string = "";
  object: any = null;
  objectKeys: string[] = [];
  objectActionTitle: string = "";
  objectAction = "";
  /**
   * Attributes which can not be modified.
   */
  readOnlyAttributes: string[] = [
    'fsQuotaUsed',
    'msQuotaUsed',
    'recDate',
    'role',
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

  constructor(
    public formBuilder: FormBuilder,
    private navParams: NavParams,
    private modalController: ModalController,
    public translateService: TranslateService,
    public objectService: GenericObjectService,
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
    let serverResponse: ServerResponse;
    this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      (val) => {
        serverResponse = val;
        console.log(val);
      },
      async (error) => {
        const toast = this.toastController.create({
          position: "middle",
          message: "An Server Error is accoured",
          cssClass: "bar-assertive",
          duration: 3000
        });
        (await toast).present();
      },
      async () => {
        if (serverResponse.code == "OK") {
          const toast = this.toastController.create({
            position: "middle",
            header: "Success:",
            message: serverResponse.value,
            color: "success",
            duration: 5000
          });
          (await toast).present();
          this.modalController.dismiss();
        } else {
          const toast = this.toastController.create({
            position: "middle",
            header: "An Error was accoured:",
            message: serverResponse.value,
            color: "danger",
            duration: 3000
          });
          (await toast).present();
        }
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
      } else {
        output[key] = this.object[key];
      }
    }
    console.log(output);
    return output;
  }
}


