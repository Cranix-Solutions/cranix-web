import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';

//Own modules
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { Device } from '../../../../../shared/models/data-model';

@Component({
  selector: 'cranix-device-edit',
  templateUrl: './device-edit.page.html',
  styleUrls: ['./device-edit.page.scss'],
})
export class DeviceEditPage implements OnInit {
  editForm;
  objectId: number=0;
  object: Device = null;
  objectKeys: string[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService
  ) { 
    this.object = <Device>this.objectService.selectedObject;
    this.objectKeys = Object.getOwnPropertyNames(new Device());
    console.log("DeviceEditPage:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }

  onSubmit(form){
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form,"device");
  }
  delete() {
    this.objectService.deleteObjectDialog(this.object,'device');
  }
}
