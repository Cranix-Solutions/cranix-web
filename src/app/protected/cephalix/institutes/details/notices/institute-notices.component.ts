import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
//own modules
import { Institute, Notice } from 'src/app/shared/models/cephalix-data-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';

@Component({
  selector: 'cranix-institute-notices',
  templateUrl: './institute-notices.component.html',
  styleUrls: ['./institute-notices.component.scss'],
})
export class InstituteNoticesComponent implements OnInit {
  object: Institute = null;
  objectKeys: string[] = [];
  notices: Notice[] = [];
  constructor(
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public cephalixService: CephalixService
  ) {
    this.object = <Institute>this.objectService.selectedObject;
  }

  ngOnInit() {
    this.getNotices()
  }

  getNotices() {
    let sub = this.cephalixService.getNoticesOfInst(this.object.id).subscribe(
      (val) => { this.notices = val },
      (err) => {
        console.log('getNotices' + this.object.id);
        console.log(err)
      },
      () => { sub.unsubscribe(); })
  }

  async redirectToAdd(ev: Event) {
    let notice = new Notice();
    notice.cephalixInstituteId = this.object.id;
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
        console.log("Object was created:", dataReturned.data)
      }
    });
    (await modal).present();
  }
}
