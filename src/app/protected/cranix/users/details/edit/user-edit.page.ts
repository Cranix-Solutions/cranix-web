import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { User } from 'src/app/shared/models/data-model';

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
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService
  ) { 
    this.object = <User>this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(new User());
    console.log("UserEditPage:" + this.objectKeys);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }

  onSubmit(form){
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form,"user");
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'user');
  }
}
