import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
//own modules
import { Institute, Notice } from '../../../../../shared/models/cephalix-data-model';
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { CephalixService } from '../../../../../services/cephalix.service';
import { ObjectsEditComponent } from '../../../../../shared/objects-edit/objects-edit.component';

@Component({
  selector: 'cranix-institute-notices',
  templateUrl: './institute-notices.component.html',
  styleUrls: ['./institute-notices.component.scss'],
})
export class InstituteNoticesComponent implements OnInit {
  objectId: number = 0;
  object: Institute = null;
  objectKeys: string[] = [];
  notices: Notice[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private objectService: GenericObjectService,
    private cephalixService: CephalixService
  ) {
    this.object = this.objectService.selectedObject;

  }

  ngOnInit() {

  }

  getNotices() {
    let sub = this.cephalixService.getNoticesOfInst(this.objectId).subscribe(
      (val) => { this.notices = val },
      (err) => {
        console.log('getNotices' + this.objectId);
        console.log(err)
      },
      () => { sub.unsubscribe(); })
  }

  async redirectToAdd(ev: Event) {
    let notice = new Notice();
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "notice",
        objectAction: 'add',
        object: notice
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.getNotices();
        console.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  
}
