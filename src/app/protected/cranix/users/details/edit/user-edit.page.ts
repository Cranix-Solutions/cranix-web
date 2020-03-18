import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { User } from '../../../../../shared/models/data-model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cranix-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  editForm;
  objectId: number=0;
  object: User = null;
  objectKeys: string[] = [];
  trippel: number[] = [];
  toThree: number[] = [0,1,2];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    private objectService: GenericObjectService
  ) { 
    this.object = this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(this.object);
    for( var i = 0; i< Math.ceil(this.objectKeys.length/3); i++) {
      this.trippel.push(i);
    }
    console.log("UserEditPage:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }

}
