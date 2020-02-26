import { Component, OnInit } from '@angular/core';
import { NavParams,  ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'cranix-select-columns',
  templateUrl: './select-columns.component.html',
  styleUrls: ['./select-columns.component.scss'],
})
export class SelectColumnsComponent implements OnInit {

  editForm: FormGroup;
  objectPath: string = "";
  columns: string[] = [];
  selected : string[] = [];

  constructor(  
    public formBuilder: FormBuilder,
    private navParams: NavParams,
    private modalController: ModalController,
    private router: Router,
    private storage: Storage,
    public  translateService: TranslateService) {
      this.columns  =  this.navParams.get('columns');
      this.selected  =  this.navParams.get('selected');
      this.objectPath  =  this.navParams.get('objectPath');
     }

  ngOnInit() {
    var object: any = {};
    for( let key of  this.columns ) {
      object[key] = this.selected.indexOf(key) != -1;
    }
    console.log("Object:" + object);
    this.editForm = this.formBuilder.group(object);
  }

  closeWindow() {
    this.modalController.dismiss();
  }
  onSubmit(object) {
    console.log(object);
    var myArray: string[] = [];
    for( let key of this.columns) {
      if(object[key]){
        myArray.push(key);
      }
    }
    console.log(myArray);
    this.storage.set(this.objectPath,JSON.stringify(myArray));
    this.modalController.dismiss(myArray);
  } 
}
