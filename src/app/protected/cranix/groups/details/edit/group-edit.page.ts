import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Group } from 'src/app/shared/models/data-model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cranix-group-edit',
  templateUrl: './group-edit.page.html',
  styleUrls: ['./group-edit.page.scss'],
})
export class GroupEditPage implements OnInit {
  editForm;
  objectId: number=0;
  object: Group = null;
  objectKeys: string[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService
  ) { 
    this.object = <Group>this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(new Group());
    console.log("GroupEditPage:");
    console.log(this.object);
    console.log(this.objectKeys);
  }
  ngOnInit() {
    //this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
    this.editForm = this.formBuilder.group(this.object);
  }
  onSubmit(form){
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form,"group");
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'group');
  }  
}
