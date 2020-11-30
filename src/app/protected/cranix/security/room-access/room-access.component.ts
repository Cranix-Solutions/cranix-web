import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { SystemService } from 'src/app/services/system.service';
import { ApplyBTNRenderer } from 'src/app/pipes/ag-apply-renderer';

@Component({
  selector: 'cranix-room-access',
  templateUrl: './room-access.component.html',
  styleUrls: ['./room-access.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoomAccessComponent implements OnInit {
  segment = 'list';
  rowData: AccessInRoom[] = [];
  notActive: boolean = true;
  disabled: boolean = false;
  accessOptions = {};
  context;
  accessApi;
  accessColumnApi;
  statusApi;
  statusColumnApi;
  columnDefs: any[] = [];
  statusColumnDefs: any[] = [];
  autoGroupColumnDef;
  defaultColDef;
  grouping = '';
  modules = [AllModules, RowGroupingModule];

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public systemService: SystemService,
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
      resizable: false
    };
    this.autoGroupColumnDef = {
      minWidth: 200
    };
  }

  ngOnInit() {
    this.createColumnDef();
    this.createAccesColumnDef();
    this.readDatas();
  }

  createAccesColumnDef() {
    this.statusColumnDefs = [
      {
        field: "id",
        hide: true
      },
      {
        sortable: true,
        headerName: this.languageS.trans('room'),
        field: 'roomName'
      }, {
        headerName: this.languageS.trans('login'),
        field: 'login',
        cellRendererFramework: YesNoBTNRenderer
      }, {
        headerName: this.languageS.trans('portal'),
        field: 'portal',
        cellRendererFramework: YesNoBTNRenderer
      }, {
        headerName: this.languageS.trans('printing'),
        field: 'printing',
        cellRendererFramework: YesNoBTNRenderer
      }, {
        headerName: this.languageS.trans('proxy'),
        field: 'proxy',
        cellRendererFramework: YesNoBTNRenderer
      }, {
        headerName: this.languageS.trans('direct'),
        field: 'direct',
        cellRendererFramework: YesNoBTNRenderer
      }, {
        headerName: this.languageS.trans('Apply Default'),
        field: 'apply_default',
        cellRendererFramework: ApplyBTNRenderer
      }
    ];
  }
  toggle(id, field: string, value: boolean, rowIndex: number) {
    console.log(id, field, value, rowIndex)
    this.securityService.actualStatus[rowIndex][field] = !value
    let rows = []
    rows.push(this.statusApi.getDisplayedRowAtIndex(rowIndex));
    this.securityService.setAccessStatusInRoom(this.securityService.actualStatus[rowIndex]);
    this.statusApi.redrawRows({ rowNodes: rows });
  }

  apply(data: AccessInRoom, rowIndex: number) {
    let sent = false
    for (let access of this.rowData) {
      if (access.roomId == data.roomId && access.accessType == "DEF") {
        this.securityService.setAccessStatusInRoom(access)
        sent = true
        break
      }
    }
    if (!sent) {
      this.securityService.getActualAccessStatus()
    } else {
      this.objectService.warningMessage(
        this.languageS.trans("There is no default access status for this room.")
      )
    }
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
        case "action": {
          col['sortable'] = true;
          break;
        }
        case "accessType": {
          col['headerClass'] = "rotate-header-class"
          col['sortable'] = true;
          break;
        }
        default: {
          col['headerClass'] = "rotate-header-class"
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
  onQuickFilterChanged(quickFilter) {
    if (this.segment == 'list') {
      this.accessApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
      this.accessApi.doLayout();
    } else {
      this.statusApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
      this.statusApi.doLayout();
    }
  }
  segmentChanged(event) {
    if (this.segment == 'status') {
      this.createAccesColumnDef();
    }
    this.segment = event.detail.value;
    this.notActive = !this.notActive
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
  statusGridReady(params) {
    this.statusApi = params.api;
    this.statusColumnApi = params.columnApi;
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
    this.systemService.applyServiceState('SuSEfirewall2', 'activ', 'restart')
  }
  stopFirewall() {
    this.systemService.applyServiceState('SuSEfirewall2', 'activ', 'false')
  }
  delete() {
    let accessSelected = this.accessApi.getSelectedRows();
    if (accessSelected.length == 0) {
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
