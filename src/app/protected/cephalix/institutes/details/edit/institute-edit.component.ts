import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { Institute } from '../../../../../shared/models/cephalix-data-model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cranix-institute-edit',
  templateUrl: './institute-edit.component.html',
  styleUrls: ['./institute-edit.component.scss'],
})
export class InstituteEditComponent implements OnInit {
  editForm;
  object: Institute = null;
  objectKeys: string[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    private objectService: GenericObjectService
  ) { 
    this.object = this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(this.object);
    console.log("InstituteEditComponent:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }

}
