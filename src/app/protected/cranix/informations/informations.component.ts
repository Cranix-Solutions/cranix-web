import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { InformationsService } from 'src/app/services/informations.services';
import { ModalController } from '@ionic/angular';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Announcenement, Contact, FAQ } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss'],
})
export class InformationsComponent implements OnInit {
  segment = "announcement"
  infos = {};
  ownedInfos = {};
  allInfos = {};
  owned: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public informationsService: InformationsService,
    public modalController: ModalController
  ) {

  }

  ngOnInit() { }
  ngAfterViewInit() {
    this.informationsService.getCategories();
    for (let infoType of this.informationsService.infoTypes) {
      this.getInfos(infoType)
      this.getOwnedInfos(infoType)
    }
  }
  segmentChanged(event) {
    console.log(event)
    this.segment = event.detail.value;
    if (this.owned) {
      this.infos = this.ownedInfos[this.segment]
    } else {
      this.infos = this.allInfos[this.segment]
    }
  }

  getInfos(infoType) {
    this.allInfos[infoType] = {}
    this.informationsService.getInfos(infoType).subscribe(
      (val) => {
        for (let tmp of val) {
          for (let category of tmp.categoryIds) {
            if (!this.allInfos[infoType][category.id]) {
              this.allInfos[infoType][category.id] = []
            }
            this.allInfos[infoType][category.id].push(tmp);
          }
        }
        if (infoType == this.segment && !this.owned) {
          console.log(this.infos)
          this.infos = this.allInfos[this.segment]
        }
      }
    )
  }
  getOwnedInfos(infoType) {
    this.ownedInfos[infoType] = {}
    this.informationsService.getOwnedInfos(infoType).subscribe(
      (val) => {
        for (let tmp of val) {
          for (let category of tmp.categories) {
            if (!this.ownedInfos[infoType][category.id]) {
              this.ownedInfos[infoType][category.id] = []
            }
            this.ownedInfos[infoType][category.id].push(tmp);
          }
        }
        if (infoType == this.segment && this.owned) {
          console.log(this.infos)
          this.infos = this.ownedInfos[this.segment]
        }
      }
    )
  }

  async addEditInfo(id: number) {
    const modal = await this.modalController.create({
      component: AddEditInfoPage,
      componentProps: {
        'infoId': id,
        'infoType': this.segment
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getOwnedInfos(this.segment);
    });
    await modal.present();
  }
  getOwned() {
    this.owned = true;
    this.infos = this.ownedInfos[this.segment];
  }
  getNotOwned() {
    this.owned = false;
    this.infos = this.allInfos[this.segment]
  }
  searchInfo() {
  }
}

@Component({
  selector: 'add-edit-info-page',
  templateUrl: 'add-edit-info.html'
})
export class AddEditInfoPage implements OnInit {

  info
  categories = []
  disabled: boolean = false;
  @Input() infoType
  @Input() infoId
  constructor(
    public modalCtrl: ModalController,
    public informationsService: InformationsService,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    if (this.infoId == 0) {
      switch (this.infoType) {
        case 'contact': { this.info = new Contact(); break; }
        case 'faq': { this.info = new FAQ(); break; }
        case 'task': { this.info = new Announcenement(); this.info.issue = 'task'; break; }
        case 'announcement': { this.info = new Announcenement(); this.info.issue = 'announcement'; break; }
      }
    } else {
      this.informationsService.getInfo(this.infoType, this.infoId).subscribe(
        (val) => { this.info = val }
      )
    }
  }

  onSubmit(val) {
    console.log(val)
    this.info.categoryIds = []
    for (let cat of this.categories) {
      this.info.categoryIds.push(cat.id)
    }
    this.informationsService.addInfo(this.infoType, val).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss("OK")
      }
    )
  };
}
