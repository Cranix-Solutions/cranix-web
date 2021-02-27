import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { InformationsService } from 'src/app/services/informations.services';
import { ModalController } from '@ionic/angular';
import { GenericObjectService } from 'src/app/services/generic-object.service';

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
          for (let category of tmp.categories) {
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

  async addInfo() {
    const modal = await this.modalController.create({
      component: AddInfoPage,
      componentProps: {
        'infoType': this.segment
      }
    });
    return await modal.present().then((val) => {
      console.log("okok")
      this.getOwnedInfos(this.segment);
    })
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
  selector: 'add-info-page',
  templateUrl: 'add-info.html'
})
export class AddInfoPage implements OnInit {

  info = {
    title: "",
    abstract: "",
    keywords: "",
    issue: "",
    name: "",
    email: "",
    phone: "",
    text: "",
    categoryIds: []
  }
  disabled: boolean = false;
  @Input() infoType
  constructor(
    public modalCtrl: ModalController,
    public informationsService: InformationsService,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() { }
  onSubmit(val) {
    console.log(val)
    this.informationsService.addInfo(this.infoType, val).subscribe(
      (val) => { 
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss("OK")
      }
    )
  };
}
