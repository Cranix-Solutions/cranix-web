import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Hwconf } from 'src/app/shared/models/data-model';
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
    public objectService: GenericObjectService
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
      myObject['part-'+part.id+"-name"] = part.name
      myObject['part-'+part.id+"-description"] = part.description
      myObject['part-'+part.id+"-os"] = part.os
      myObject['part-'+part.id+"-tool"] = part.tool
      myObject['part-'+part.id+"-joinType"] = part.joinType
    }
    this.editForm = this.formBuilder.group(myObject);
  }
  onSubmit(form) {
    console.log(form);
    let idToIndex = {};
    for( let index in this.object.partitions ){
      idToIndex[this.object.partitions[index].id] = index;
    }
    this.object.name=form.name;
    this.object.description=form.description;
    this.object.deviceType=form.deviceType;
    for(let key of Object.getOwnPropertyNames(form) ){
      let lkey = key.split('-');
      if(lkey[0] && lkey[0] == 'part') {
        this.object.partitions[idToIndex[lkey[1]]][lkey[2]] = form[key];
      }
    }
    console.log(this.object);
    this.objectService.modifyObjectDialog(this.object, "hwconf");
  }
  cleanUp(ev: Event){
    //TODO
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'hwconf');
  }
}
