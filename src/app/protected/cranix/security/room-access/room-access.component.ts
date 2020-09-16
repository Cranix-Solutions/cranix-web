import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SecurityService } from 'src/app/services/security-service';
import { AccessInRoom } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ModalController } from '@ionic/angular';
import { AddEditRoomAccessComponent } from './add-edit-room-access/add-edit-room-access.component';
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';

@Component({
  selector: 'cranix-room-access',
  templateUrl: './room-access.component.html',
  styleUrls: ['./room-access.component.scss'],
})
export class RoomAccessComponent implements OnInit {
  segment = 'list';
  rowData: AccessInRoom[] = [];
  disabled: boolean= false;
  accessOptions = {};
  context;
  accessApi;
  accessColumnApi;
  columnDefs: any[] = [];
  autoGroupColumnDef;
  defaultColDef;
  grouping = '';
  modules = [AllModules, RowGroupingModule];

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public securityService: SecurityService
  ) {
    this.context = { componentParent: this };
    this.defaultColDef = {
      flex: 1,
      cellStyle: { 'justify-content': "center" },
      minWidth: 100,
      maxWidth: 150,
      suppressMenu: true,
      sortable: false,
      resizable: true,
    };
    this.autoGroupColumnDef = {
      minWidth: 200
    };
    this.createColumnDef();
  }

  ngOnInit() {
    this.readDatas();
  }

  createColumnDef() {
    this.columnDefs = [];
    for (let key of Object.getOwnPropertyNames(new AccessInRoom())) {
      let col = {};
      col['headerName'] = this.languageS.trans(key);
      col['field'] = key;
      switch (key) {
        case "roomId": {
          col['valueGetter'] = function (params) {
            if (params.data) {
              return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
            }
          }
          if (this.grouping == 'roomId') {
            col['rowGroup'] = true;
            col['hide'] = true;
          }
          col['sortable'] = true;
          break;
        }
        case "pointInTime": {
          if (this.grouping == 'pointInTime') {
            col['rowGroup'] = true;
            col['hide'] = true;
          }
          col['sortable'] = true;
          break;
        }
        default: {
          col['sortable'] = false;
          col['minWidth'] = 70;
          col['maxWidth'] = 100;
          col['cellRendererFramework'] = YesNoBTNRenderer;
        }
      }
      this.columnDefs.push(col);
    }
    switch (this.grouping) {
      case '': {
        this.grouping = 'roomId';
        break
      }
      case 'roomId': {
        this.grouping = 'pointInTime';
        break;
      }
      case 'pointInTime': {
        this.grouping = '';
        break;
      }
    }
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
  }

  readDatas() {
    let sub = this.securityService.getAllAccess().subscribe(
      (val) => { this.rowData = val },
      (err) => { this.authService.log(err) },
      () => { sub.unsubscribe(); }
    );
  }
  accessGridReady(params) {
    this.accessApi = params.api;
    this.accessColumnApi = params.columnApi;
    this.authService.log(this.accessApi);
    this.authService.log(this.accessColumnApi);
  }
  async redirectToAddEdit(ev: Event, accesInRoom: AccessInRoom) {
    let action = "add";
    if (accesInRoom) {
      this.objectService.selectedObject = accesInRoom;
      action = "modify";
    } else {
      accesInRoom = new AccessInRoom();
    }
    const modal = await this.modalCtrl.create({
      component: AddEditRoomAccessComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "access",
        objectAction: action,
        object: accesInRoom
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified or deleted", dataReturned.data)
      }
      this.readDatas();
    });
    (await modal).present();
  }
  restartFirewall() {

  }

  delete() {
    let accessSelected = this.accessApi.getSelectedRows();
    if( accessSelected.length == 0 ) {
      this.objectService.selectObject();
      return;
    }
    this.disabled = true;
    for (let obj of accessSelected) {
      this.securityService.deleteAccessInRoom(obj.id);
      setTimeout(() => { this.authService.log("World!"); }, 1000);
    }
    this.readDatas();
    this.disabled = false;
  }
}
