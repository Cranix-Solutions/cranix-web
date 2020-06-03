import { Component, OnInit } from '@angular/core';
import { CheckBoxBTNRenderer } from 'src/app/pipes/ag-checkbox-renderer';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SecurityService } from 'src/app/services/security-service';
import { RoomIdCellRenderer } from 'src/app/pipes/ag-roomid-render';
import { AccessInRoom } from 'src/app/shared/models/secutiry-model';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import 'ag-grid-enterprise';

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

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
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
            col['rowGroup'] = true,
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
      case '': { this.grouping = 'roomId'; break }
      case 'roomId': { this.grouping = 'pointInTime'; break }
      case 'pointInTime': { this.grouping = ''; break }
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
    console.log("accessGridReady");
  }
  accessSelectionChanged() {
    this.accessSelected = this.accessApi.getSelectedRows();
  }

  restartFirewall() {

  }

  addStatus() {

  }

  delete() { }
}
