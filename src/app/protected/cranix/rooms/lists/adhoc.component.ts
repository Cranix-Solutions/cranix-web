import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from '@ag-grid-enterprise/all-modules';
import { ModalController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//Own stuff
import { AdHocRoom } from 'src/app/shared/models/data-model'
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
@Component({
  selector: 'cranix-adhoc',
  templateUrl: './adhoc.component.html',
  styleUrls: ['./adhoc.component.scss'],
})
export class AdhocComponent implements OnInit {

  objectKeys: string[] =Object.getOwnPropertyNames(new AdHocRoom());
  displayedColumns: string[] = ['name', 'description','devCount', 'devicesProUser','roomControl', 'groupIds', 'userIds', 'studentsOnly'];
  sortableColumns:    string[] = ['name', 'description', 'devCount','devicesProUser', 'roomControl','groupIds', 'userIds',];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
  rowData = [];
  
  constructor(
    public authService: AuthenticationService,
    public languageS: LanguageService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public storage: Storage
  ) { 
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.storage.get('AdhocComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
      }
    });
    this.objectService.getObjects('adhocroom').subscribe(obj => this.rowData = obj);
    delete this.objectService.selectedObject;
    this.createColumnDefs();
  }

  createColumnDefs() {
    let columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['sortable'] = (this.sortableColumns.indexOf(key) != -1);
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['width'] = 150;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          break;
        }
        case 'studentsOnly': {
          col['cellRendererFramework'] = YesNoBTNRenderer;
          break;
        }
        case 'groupIds': {
          col['valueGetter'] = function (params) {
            return params.data.groupIds.length;
          }
          break;
        }
        case 'userIds': {
          col['valueGetter'] = function (params) {
            return params.data.userIds.length;
          }
          break;
        }
      }
      columnDefs.push(col);
    }
    let action = {
      headerName: "",
      width: 230,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: EditBTNRenderer
    };
    columnDefs.splice(1, 0, action);
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }
  public redirectToDelete = (adhoc: AdHocRoom) => {
    this.objectService.deleteObjectDialog(adhoc, 'adhocroom')
  }

  async openCollums(ev: any) {
    const modal = await this.modalCtrl.create({
      component: SelectColumnsComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns,
        objectPath: "AdhocComponent.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = dataReturned.data.concat(['actions']);
        this.createColumnDefs();
      }
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }

  openActions(event,adhocroom){
  
  }

  async redirectToEdit(event,adhocroom: AdHocRoom) {
    let action = "";
    if (adhocroom) {
      action = 'modify';
      delete adhocroom.hwconfId;
      delete adhocroom.network;
      delete adhocroom.groupIds;
      this.objectService.selectedObject = adhocroom;
    } else {
      action = "add";
      adhocroom = new AdHocRoom;
      adhocroom.network = this.objectService.selects['network'][0];
      adhocroom.hwconfId = 3;
      adhocroom.devCount = 512;
      adhocroom.roomControl = 'allTeachers'
    }
    delete adhocroom.accessInRooms;
    delete adhocroom.groups;
    delete adhocroom.netMask;
    delete adhocroom.roomType;
    delete adhocroom.places;
    delete adhocroom.rows;
    delete adhocroom.startIP;
    delete adhocroom.users;
    delete adhocroom.userIds;
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "adhocroom",
        objectAction: action,
        object: adhocroom
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
}
