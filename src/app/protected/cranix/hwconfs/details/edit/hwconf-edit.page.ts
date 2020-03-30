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
  objectId: number=0;
  object: Hwconf = null;
  objectKeys: string[] = [];
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
    this.editForm = this.formBuilder.group(this.object);
  }
  onSubmit(form){
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form,"hwconf");
  }
}
