import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//own 
import { User, Group, Room, Device, HWConfig, UserC } from '../models/data-model';
import { Institute, Customer } from '../models/cephalix-data-model';
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
  objectAction = "";
  readOnlyAttributes: string[] = [
    'fsQuotaUsed',
    'msQuotaUsed',
    'recDate',
    'role',
  ]

  hiddenAttributes: string[] = [
    'id',
    'ownerId',
    'deleted'
  ]

  constructor(
    public formBuilder: FormBuilder,
    private navParams: NavParams,
    private modalController: ModalController,
    public translateService: TranslateService,
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
    if (key == 'birthDay'|| key == 'validity' || key=='recDate' || key == 'validFrom' || key == 'validUntil' ) {
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
    if (this.readOnlyAttributes.indexOf(key) != -1) {
      return "stringRO";
    }
    return "string";
  }

  onSubmit(event) {
    console.log(event);
    this.modalController.dismiss();
  }

  convertObject(){
    //TODO introduce checks
    let output: any ={};
    for(let key in this.object){
      if(key == 'birthDay' || key == 'validity' || key=='recDate' || key == 'validFrom' || key == 'validUntil' ){
        let date =  new Date(this.object[key]);
        output[key] = date.toJSON();
      } else {
        output[key] = this.object[key];
      }
    }
    console.log(output);
    return output;
  }
}


