import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { Hwconf } from '../../../../../shared/models/data-model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cranix-hwconf-edit',
  templateUrl: './hwconf-edit.page.html',
  styleUrls: ['./hwconf-edit.page.scss'],
})
export class HwconfEditPage implements OnInit {
  editForm;
  objectId: number = 0;
  object: Hwconf = null;
  objectKeys: string[] = [];
  operatingSystems: string[] = ["WinBoot", "Win", "Win10", "Linux"];
  joinTypes: string[] = ["no", "Domain"];
  tools: string[] = ["partimage", "partclone", "dd", "dd_rescue"];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    private objectService: GenericObjectService
  ) {
    this.object = <Hwconf>this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(new Hwconf());
    console.log("HwconfEditPage:");
    console.log(this.object);
    console.log(this.objectKeys);
  }
  ngOnInit() {
    //this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
    let myObject = {}
    for (let key of this.objectKeys) {
      if (key != "partitions") {
        myObject[key] = this.object[key]
      }
    }
    for(let part of this.object.partitions ){
      myObject[part.id+"-name"] = part.name
      myObject[part.id+"-desc"] = part.description
      myObject[part.id+"-os"] = part.os
      myObject[part.id+"-tool"] = part.tool
      myObject[part.id+"-join"] = part.joinType
    }
    this.editForm = this.formBuilder.group(myObject);
  }
  onSubmit(form) {
    console.log(form);
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form, "hwconf");
  }
}
