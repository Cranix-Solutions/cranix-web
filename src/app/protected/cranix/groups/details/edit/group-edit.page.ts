import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { Group } from '../../../../../shared/models/data-model';
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
    private objectService: GenericObjectService
  ) { 
    this.object = this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(this.object);
    console.log("GroupEditPage:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }
}
