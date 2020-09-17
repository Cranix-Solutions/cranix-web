import { Component, OnInit} from '@angular/core';
import { GridApi, ColumnApi } from '@ag-grid-enterprise/all-modules';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DeviceActionBTNRenderer } from 'src/app/pipes/ag-device-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Device } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { DevicePrintersComponent } from './../details/printers/device-printers.component';
import { AddDeviceComponent } from './../add-device/add-device.component';

@Component({
  selector: 'cranix-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  selectedRoom;
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'mac', 'ip', 'hwconfId', 'roomId'];
  sortableColumns: string[] = ['name', 'mac', 'ip', 'hwconfId', 'roomId'];
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
    public alertController: AlertController,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public popoverCtrl: PopoverController,
    public route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Device());
    this.createColumnDefs();
    this.defaultColDef = {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu : true
      }
  }
  ngOnInit() {
    this.storage.get('DevicesComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    if (this.objectService.selectedRoom) {
      this.selectedRoom = this.objectService.selectedRoom;
      delete this.objectService.selectedRoom;
      this.objectService.getObjects('device').subscribe(obj => {
      this.rowData = [];
        for (let dev of obj) {
          if (dev.roomId == this.selectedRoom.id) {
            this.rowData.push(dev);
          }
        }
      }
      );
    } else {
      this.objectService.getObjects('device').subscribe(obj => this.rowData = obj);
      delete this.selectedRoom;
    }
    delete this.objectService.selectedObject;
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
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
          col['minWidth'] = 170;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          columnDefs.push(col);
          columnDefs.push({
            headerName: "",
            minWidth: 150,
            suppressSizeToFit: true,
            cellStyle: { 'padding': '2px', 'line-height': '36px' },
            field: 'actions',
            pinned: 'left',
            cellRendererFramework: DeviceActionBTNRenderer
          })
          continue;
        }
        case 'hwconfId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('hwconf', params.data.hwconfId);
          }
          break;
        }
        case 'roomId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('room', params.data.roomId);
          }
          break;
        }
      }
      columnDefs.push(col);
    }
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
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

  redirectToDelete(device: Device) {
    this.objectService.deleteObjectDialog(device, 'device')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async openActions(ev: any, objId: number) {
    if (this.gridApi.getSelectedRows().length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < this.gridApi.getSelectedRows().length; i++) {
        objectIds.push(this.gridApi.getSelectedRows()[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "device",
        objectIds: objectIds,
        selection: this.gridApi.getSelectedRows()
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, device: Device) {
    let action = "modify";
    if (!device) {
      device = new Device();
      action = "add";
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: "medium-modal",
      componentProps: {
        objectType: "device",
        objectAction: action,
        object: device
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

  async setPrinters(device: Device) {
    this.objectService.selectedObject = device;
    const modal = await this.modalCtrl.create({
      component: DevicePrintersComponent,
      cssClass: "small-modal",
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = dataReturned.data.concat(['actions']);
      }
      this.createColumnDefs();
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }
  /**
* Function to Select the columns to show
* @param ev 
*/
  async openCollums(ev: any) {
    const modal = await this.modalCtrl.create({
      component: SelectColumnsComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns,
        objectPath: "DevicesComponent.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = dataReturned.data.concat(['actions']);
      }
      this.createColumnDefs();
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }

  async addDevice(ev: Event) {
    console.log('selected room is,', this.selectedRoom);
    const modal = await this.modalCtrl.create({
      component: AddDeviceComponent,
      cssClass: 'medium-modal',
      componentProps: {
        rooms: this.selectedRoom
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
