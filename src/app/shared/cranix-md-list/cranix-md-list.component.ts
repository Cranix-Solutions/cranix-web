import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'cranix-md-list',
  templateUrl: './cranix-md-list.component.html',
  styleUrls: ['./cranix-md-list.component.scss'],
})
export class CranixMdListComponent implements OnInit {

  min: number;
  step: number;
  max: number;
  rowData = [];
  left1: string;
  left2: string;
  left3: string;
  @Input() objectType: string;
  @Input() context;
  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    public utilService: UtilsService
  ) {
    this.authService.log("CranixMdListComponent constructor was called")
    this.utilService.actMdList = this;
   }

  async ngOnInit() {
    this.objectService.selection = []
    this.objectService.selectedIds = []
    this.step = Number(this.authService.settings.lineProPageMD);
    if( !this.min ) {
      this.min = -1;
    }
    if( !this.step || this.step < 3 ) {
      this.step = 3;
    }
    this.max = this.min + this.step + 1;
    this.authService.log("CranixMdListComponent Min Max Step",this.min,this.max,this.step)
    this.left1 = 'name'
    this.left2 = 'description'
    this.left3 = ''
    switch (this.objectType) {
      case "education/user":
      case "user": {
        this.left1 = "uid"
        this.left2 = "surName"
        this.left3 = "givenName"
        break
      }
      case 'device': {
        this.left2 = 'ip'
        break
      }
      case 'institute': {
        this.left2 = "regCode"
        break
      }
      case 'customer': {
        this.left2 = "locality"
        break
      }
    }
    while (!this.objectService.allObjects[this.objectType]) {
      await new Promise(f => setTimeout(f, 1000));
    }
    if (this.objectType == 'device') {
      for (let dev of this.objectService.allObjects[this.objectType]) {
        if( dev.hwconfId == 2) {
          continue
        }
        if (this.objectService.selectedRoom && dev.roomId != this.objectService.selectedRoom) {
          
        }
        this.rowData.push(dev);
      }
    } else {
      this.rowData = this.objectService.allObjects[this.objectType]
    }
    if (this.max > (this.rowData.length)) {
      this.max = this.rowData.length
    }
  }

  back() {
    this.min -= this.step;
    if (this.min < -1) {
      this.min = -1
    }
    this.max = this.min + this.step + 1;
    if (this.max > (this.rowData.length)) {
      this.max = this.rowData.length
    }
  }

  forward() {
    this.max += this.step;
    if (this.max < (this.step)) {
      this.max = this.step
    }
    this.min = this.max - this.step - 1;
    if (this.max > (this.rowData.length)) {
      this.max = this.rowData.length
    }
  }

  checkChange(ev,dev){
    if( ev.detail.checked ) {
      this.objectService.selectedIds.push(dev.id)
      this.objectService.selection.push(dev)
    } else {
      this.objectService.selectedIds = this.objectService.selectedIds.filter(id => id != dev.id)
      this.objectService.selection   = this.objectService.selection.filter(obj => obj.id != dev.id)
    }
  }

  onQuickFilterChanged() {
    let filter = (<HTMLInputElement>document.getElementById('filterMD')).value.toLowerCase();
    this.min = -1;
    this.max = this.step;
    this.rowData = [];
    switch (this.objectType) {
      case "adhocroom": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.name.toLowerCase().indexOf(filter) != -1 ||
            obj.description.toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "device": {
        for (let dev of this.objectService.allObjects[this.objectType]) {
          if (this.objectService.selectedRoom && dev.roomId != this.objectService.selectedRoom) {
            continue
          }
          if (
            dev.name.toLowerCase().indexOf(filter) != -1 ||
            dev.ip.indexOf(filter) != -1 ||
            dev.mac.toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(dev)
          }
        }
        break
      }
      case "education/user":
      {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.uid.toLowerCase().indexOf(filter) != -1 ||
            obj.givenName.toLowerCase().indexOf(filter) != -1 ||
            obj.surName.toLowerCase().indexOf(filter) != -1 
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "education/group": 
      case "group": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.name.toLowerCase().indexOf(filter) != -1 ||
            obj.description.toLowerCase().indexOf(filter) != -1 ||
            this.languageS.trans(obj.groupType).toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "institute": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.name.toLowerCase().indexOf(filter) != -1 ||
            (obj.regCode && obj.regCode.toLowerCase().indexOf(filter) != -1) ||
            (obj.locality && obj.locality.toLowerCase().indexOf(filter) != -1)
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "printer": {
        for (let dev of this.objectService.allObjects[this.objectType]) {
          if (
            dev.name.toLowerCase().indexOf(filter) != -1 ||
            dev.model.indexOf(filter) != -1
          ) {
            this.rowData.push(dev)
          }
        }
        break
      }
      case "room": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.name.toLowerCase().indexOf(filter) != -1 ||
            obj.description.toLowerCase().indexOf(filter) != -1 ||
            this.languageS.trans(obj.roomType).toLowerCase().indexOf(filter) != -1 ||
            this.languageS.trans(obj.roomControl).toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "user": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.uid.toLowerCase().indexOf(filter) != -1 ||
            obj.givenName.toLowerCase().indexOf(filter) != -1 ||
            obj.surName.toLowerCase().indexOf(filter) != -1 ||
            this.languageS.trans(obj.role).toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
      case "challenges/challenge": 
      case "challenges/todo": {
        for (let obj of this.objectService.allObjects[this.objectType]) {
          if (
            obj.description.toLowerCase().indexOf(filter) != -1
          ) {
            this.rowData.push(obj)
          }
        }
        break
      }
    }

    if (this.rowData.length < this.step) {
      this.min = -1
      this.max = this.rowData.length
    }
  }
}
