import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'cranix-select-columns',
  templateUrl: './select-columns.component.html',
  styleUrls: ['./select-columns.component.scss'],
})
export class SelectColumnsComponent implements OnInit {

  object: any = {};
  @Input() objectPath: string = "";
  @Input() columns: string[] = [];
  @Input() selected: string[] = [];
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private storage: Storage,
    public translateService: TranslateService) {
  }

  ngOnInit() {
    for (let key of this.columns) {
      this.object[key] = this.selected.indexOf(key) != -1;
    }
    console.log("Object:" + this.object);
  }

  closeWindow() {
    this.modalController.dismiss();
  }
  onSubmit() {
    console.log(this.object);
    var myArray: string[] = [];
    for (let key of this.columns) {
      if (this.object[key]) {
        myArray.push(key);
      }
    }
    console.log(myArray);
    this.storage.set(this.objectPath, JSON.stringify(myArray));
    this.modalController.dismiss(myArray);
  }
}
