import { Component, OnInit } from '@angular/core';
import { ModalController,  ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
//Own stuff
import { SoftwareService } from 'src/app/services/softwares.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Package } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-download-softwares',
  templateUrl: './download-softwares.component.html',
  styleUrls: ['./download-softwares.component.scss'],
})
export class DownloadSoftwaresComponent implements OnInit {

  editForm: FormGroup;
  softwares: any[];

  constructor(
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService,
    public softwareService: SoftwareService,
    public modalController: ModalController
  ) {
    this.editForm = this.formBuilder.group(this.objectService.packagesAvailable);
   }

  ngOnInit() {
  }

  closeWindow() {
    this.modalController.dismiss();
  }
}
