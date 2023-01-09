import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { InformationsService } from 'src/app/services/informations.services';
import { ModalController } from '@ionic/angular';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Announcenement, Contact, FAQ, TaskResponse } from 'src/app/shared/models/data-model';

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
  taskResponses = {};
  title = "announcements";
  categoryClosed = {}

  constructor(
    public authService: AuthenticationService,
    public informationsService: InformationsService,
    public modalController: ModalController
  ) {
    this.owned = this.authService.isAllowed('information.add')
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.informationsService.getCategories();
    for (let infoType of this.informationsService.infoTypes) {
      this.getInfos(infoType)
      if (this.authService.isAllowed('information.add')) {
        this.getOwnedInfos(infoType)
      }
    }
    this.getTaskResponses()
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
    if (this.owned) {
      this.title = 'List of owned ' + this.segment + 's'
      this.infos = this.ownedInfos[this.segment]
    } else {
      this.title = this.segment + 's'
      this.infos = this.allInfos[this.segment]
    }
  }

  toggleCategory(id) {
    console.log(id)
    if (this.categoryClosed[id]) {
      (<HTMLInputElement>document.getElementById("category" + id)).style.height = "100%"
      this.categoryClosed[id] = false
    } else {
      (<HTMLInputElement>document.getElementById("category" + id)).style.height = "0px"
      this.categoryClosed[id] = true
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
          this.infos = this.allInfos[this.segment]
        }
      }
    )
  }

  getOwnedInfos(infoType) {
    this.ownedInfos[infoType] = new Map()
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
          this.infos = this.ownedInfos[this.segment]
        }
      }
    )
  }

  getTaskResponses() {
    this.informationsService.getMyResponses().subscribe(
      (val) => {
        for (let tmp of val) {
          this.taskResponses[tmp.parentId] = tmp.id
        }
      }
    )
  }

  deleteInfo(info) {
    //TODO 
  }
  async addEditInfo(id: number) {
    const modal = await this.modalController.create({
      component: AddEditInfoPage,
      cssClass: 'big-modal',
      componentProps: {
        'infoId': id,
        'infoType': this.segment,
        'owned': this.owned
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (this.owned) {
        this.getOwnedInfos(this.segment);
      }
      if (dataReturned.data == "addResponse") {
        this.getTaskResponses()
      }
    });
    await modal.present();
  }
  async openResponse(id: number) {
    const modal = await this.modalController.create({
      component: AddEditInfoPage,
      cssClass: 'big-modal',
      componentProps: {
        'infoId': id,
        'infoType': 'taskResponse',
        'owned': false
      }
    });
    await modal.present();
  }
  getOwned() {
    this.owned = true;
    this.title = 'List of owned ' + this.segment + 's'
    this.infos = this.ownedInfos[this.segment];
  }
  getNotOwned() {
    this.owned = false;
    this.title = this.segment + 's'
    this.infos = this.allInfos[this.segment]
  }
  searchInfo() {
    let filter = (<HTMLInputElement>document.getElementById("searchInfo")).value.toLowerCase();
    var tmp;
    if (this.owned) {
      tmp = this.ownedInfos[this.segment]
    } else {
      tmp = this.allInfos[this.segment]
    }
    if (filter == "") {
      this.infos = tmp;
      return
    }
    this.infos = [];
    for (let categorId of this.informationsService.categoryIds) {
      if (tmp[categorId]) {
        this.infos[categorId] = [];
        for (let info of tmp[categorId]) {
          if (
            info.keywords.toLowerCase().indexOf(filter) != -1 ||
            info.title.toLowerCase().indexOf(filter) != -1
          ) {
            this.infos[categorId].push(info);
          }
        }
      }
    }
  }
  /*
  * opens the responses to a task
  */
  async openResponses(task: Announcenement) {
    const modal = await this.modalController.create({
      component: ShowResponses,
      cssClass: 'big-modal',
      componentProps: {
        'task': task
      }
    });
    await modal.present();
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
  @Input() owned
  constructor(
    public modalCtrl: ModalController,
    public informationsService: InformationsService,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    if (this.infoId == 0) {
      switch (this.infoType) {
        case 'contact': { this.info = new Contact(); break; }
        case 'faq':     { this.info = new FAQ(); break; }
        case 'task':    { this.info = new Announcenement(); this.info.issue = 'task'; break; }
        case 'announcement': { this.info = new Announcenement(); this.info.issue = 'announcement'; break; }
      }
    } else {
      this.informationsService.getInfo(this.infoType, this.infoId).subscribe(
        (val) => {
          this.info = val
          if (val.validFrom) {
            this.info.validFrom = new Date(val.validFrom).toISOString().substring(0, 16);
          }
          if (val.validUntil) {
            this.info.validUntil = new Date(val.validUntil).toISOString().substring(0, 16);
          }
          this.categories = val.categories
        }
      )
      if (this.infoType == "announcement" && !this.owned) {
        this.informationsService.setHaveSeen("announcement", this.infoId)
      }
    }
  }

  onSubmit() {
    if (this.infoType != "taskResponse") {
      this.info.categoryIds = []
      for (let cat of this.categories) {
        this.info.categoryIds.push(cat.id)
      }
    }
    if (this.infoId == 0) {
      this.informationsService.addInfo(this.infoType, this.info).subscribe(
        (val) => {
          this.objectService.responseMessage(val);
          this.modalCtrl.dismiss("OK")
        }
      )
    } else {
      this.informationsService.modifyInfo(this.infoType, this.info).subscribe(
        (val) => {
          this.objectService.responseMessage(val);
          this.modalCtrl.dismiss("OK")
        }
      )
    }
  }

  clone() {
    let task = new TaskResponse();
    task.parentId = this.infoId;
    task.text = this.info.text;
    this.informationsService.addResponse(task).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss("addResponse")
      }
    )
  }
}

@Component({
  selector: 'show-responses-page',
  templateUrl: 'show-responses-page.html'
})
export class ShowResponses implements OnInit {
  responses: TaskResponse[];
  response: TaskResponse;
  @Input() task
  constructor(
    public modalCtrl: ModalController,
    public informationsService: InformationsService,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {
    this.informationsService.getResponses(this.task.id).subscribe(
      (val) => { this.responses = val }
    )
  }

  openResponse(id: number) {
    for( let resp of this.responses ) {
      if( resp.id == id ) {
        this.response = resp;
        return;
      }
    }
  }

  rate(){
    this.informationsService.rateTaskResponse(this.response).subscribe(
      (val) => { 
        this.objectService.responseMessage(val)
        var i = 0;
        for( let resp of this.responses ) {
          if( resp.id == this.response.id ) {
            this.responses[i] = this.response
            break;
          }
          i++;
        }
        this.response = null
      }
    )
  }
}
