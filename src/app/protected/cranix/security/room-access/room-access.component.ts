import { Component, OnInit } from '@angular/core';
import { CheckBoxBTNRenderer } from 'src/app/pipes/ag-checkbox-renderer';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SecurityService } from 'src/app/services/security-service';
import { RoomIdCellRenderer } from 'src/app/pipes/ag-roomid-render';
import { AccessInRoom } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ModalController } from '@ionic/angular';
import {  AddEditRoomAccessComponent } from './add-edit-room-access/add-edit-room-access.component';
import { throwError } from 'rxjs';

@Component({
  selector: 'cranix-room-access',
  templateUrl: './room-access.component.html',
  styleUrls: ['./room-access.component.scss'],
})
export class RoomAccessComponent implements OnInit {
  segment = 'list';
  accessData: AccessInRoom[] = [];
  accessOptions = {};
  context;
  accessApi;
  accessColumnApi;
  accessSelected;
  columnDefs: any[] = [];
  autoGroupColumnDef;
  defaultColDef;
  grouping = '';
  modules = [ AllModules, RowGroupingModule ];

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
      minWidth: 150
    };
    this.createColumDef();
  }

  ngOnInit() {
    this.readDatas();
  }

  createColumDef() {
    this.columnDefs = [];
    for (let key of Object.getOwnPropertyNames(new AccessInRoom())) {
      let col = {};
      col['headerName'] = this.languageS.trans(key);
      col['field'] = key;
      switch (key) {
        case "roomId": {
          col['sortable'] = true;
          col['cellRendererFramework'] = RoomIdCellRenderer;
          if (this.grouping == 'roomId') {
            col['checkboxSelection'] = true;
            col['rowGroup'] = true;
            col['hide'] = true;
            col['valueGetter'] = function (params) {
              return params.context['componentParent'].objectService.idToName("room", params.data.roomId);
            }
          }
          break;
        }
        case "pointInTime": {
          col['sortable'] = true;
          if (this.grouping == 'pointInTime') {
            col['checkboxSelection'] = true;
            col['rowGroup'] = true,
              col['hide'] = true;
          }
          break;
        }
        case "action": {
          col['sortable'] = true;
          break;
        }
        case "accessType": {
          col['sortable'] = true;
          break;
        }
        default: {
          col['minWidth'] = 70;
          col['maxWidth'] = 100;
          col['cellRendererFramework'] = CheckBoxBTNRenderer;
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
        this.autoGroupColumnDef = {
          headerName: this.languageS.trans('roomId'),
          minWidth: 150
        };
	//this.accessApi.setAutoGroupColumnDef(this.autoGroupColumnDef);
        break;
      }
      case 'pointInTime': {
        this.autoGroupColumnDef = {
          headerName: this.languageS.trans('pointInTime'),
          minWidth: 150
        };
	//this.accessApi.setAutoGroupColumnDef(this.autoGroupColumnDef);
        this.grouping = ''; break
      }
    }
  }
  segmentChanged(event) {
    this.segment = event.detail.value;
  }

  readDatas() {
    let sub = this.securityService.getAllAccess().subscribe(
      (val) => { this.accessData = val },
      (err) => { console.log(err) },
      () => { sub.unsubscribe(); }
    );
  }
  accessGridReady(params) {
    this.accessApi = params.api;
    this.accessColumnApi = params.columnApi;
    console.log(this.accessApi);
    console.log(this.accessColumnApi);
  }
  accessSelectionChanged() {
    this.accessSelected = this.accessApi.getSelectedRows();
  }
  async redirectToAddEdit(ev: Event, accesInRoom: AccessInRoom) {
    let action = "add";
    if (accesInRoom) {
      this.objectService.selectedObject = accesInRoom;
    } else {
      accesInRoom = new AccessInRoom();
    }
    const modal = await this.modalCtrl.create({
      component:     AddEditRoomAccessComponent,
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
        console.log("Object was created or modified or deleted", dataReturned.data)
        this.readDatas();
      }
    });
    (await modal).present();
  }
  restartFirewall() {

  }

  delete() {
    this.accessSelected = this.accessApi.getSelectedRows();
    for( let obj of this.accessSelected ){
      this.securityService.deleteAccessInRoom(obj.id);
      setTimeout(() => {  console.log("World!"); }, 1000);
    }
    this.readDatas();
   }
}
