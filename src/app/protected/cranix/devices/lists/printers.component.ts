import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules

import { AuthenticationService } from 'src/app/services/auth.service';
import { AddPrinterComponent } from './../add-printer/add-printer.component';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { PrinterActionBTNRenderer } from 'src/app/pipes/ag-printer-renderer';
import { PrintersService } from 'src/app/services/printers.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Device, Printer } from 'src/app/shared/models/data-model'
import { YesNoBTNRenderer } from 'src/app/pipes/ag-yesno-renderer';

@Component({
  selector: 'cranix-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent implements OnInit {
  selectedRoom;
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'model', 'deviceName', 'acceptingJobs', 'activeJobs', 'windowsDriver'];
  sortableColumns: string[] = this.displayedColumns;
  columnDefs = [];
  gridOptions: GridOptions;
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  rowData: Printer[] = [];
  selection: Printer[] = [];
  selectedIds: number[] = [];

  constructor(
    public authService: AuthenticationService,
    public alertController: AlertController,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public popoverCtrl: PopoverController,
    public printersService: PrintersService,
    public route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.objectKeys = Object.getOwnPropertyNames(new Printer());
    this.createColumnDefs();
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu: true
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowHeight: 35
    }
  }
  ngOnInit() {
    this.storage.get('PrintersComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    this.rowData = this.objectService.allObjects['printer'];
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
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          break;
        }
        case 'windowsDriver': {
          col['cellStyle'] = { 'justify-content': "center" };
          col['cellRendererFramework'] = YesNoBTNRenderer
          break;
        }
        case 'acceptingJobs': {
          col['cellStyle'] = { 'justify-content': "center" };
          col['cellRendererFramework'] = YesNoBTNRenderer
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
    let action = {
      headerName: "",
      minWidth: 100,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '1px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: PrinterActionBTNRenderer
    };
    columnDefs.splice(1, 0, action);
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  selectionChanged(){
    this.selectedIds = []
    for (let i = 0; i < this.gridApi.getSelectedRows().length; i++) {
      this.selectedIds.push(this.gridApi.getSelectedRows()[i].id);
    }
    this.selection = this.gridApi.getSelectedRows()
  }
  checkChange(ev,dev: Printer){
    if( ev.detail.checked ) {
      this.selectedIds.push(dev.id)
      this.selection.push(dev)
    } else {
      this.selectedIds = this.selectedIds.filter(id => id != dev.id)
      this.selection   = this.selection.filter(obj => obj.id != dev.id)
    }
  }
  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    if (this.authService.isMD()) {
      this.rowData = [];
      for (let dev of this.objectService.allObjects['printer']) {
        if (
          dev.name.toLowerCase().indexOf(filter) != -1 ||
          dev.model.toLowerCase().indexOf(filter) != -1
        ) {
          this.rowData.push(dev)
        }
      }
    } else {
      this.gridApi.setQuickFilter(filter);
      this.gridApi.doLayout();
    }
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }

  redirectToDelete(printer: Printer) {
    this.objectService.deleteObjectDialog(printer, 'printer', '')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any, object: Printer) {
    if (object) {
      this.selectedIds.push(object.id)
      this.selection.push(object)
    } else {
      if (this.selection.length == 0) {
        this.objectService.selectObject();
        return;
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "printer",
        objectIds: this.selectedIds,
        selection: this.selection,
        gridApi: this.gridApi
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  async redirectToEdit(printer: Printer) {
    const modal = await this.modalCtrl.create({
      component: AddPrinterComponent,
      cssClass: "medium-modal",
      componentProps: {
        action: "modify",
        object: printer
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
        objectPath: "PrintersComponent.displayedColumns"
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

  async addPrinter(ev: Event) {
    const modal = await this.modalCtrl.create({
      component: AddPrinterComponent,
      cssClass: 'medium-modal',
      componentProps: {
        action: 'queue'
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
    const modal = await this.modalCtrl.create({
      component: AddPrinterComponent,
      cssClass: 'medium-modal',
      componentProps: {
        action: 'add'
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

  reset(id: number) {
    let subs = this.printersService.reset(id).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.objectService.getAllObject('printer');
          this.modalCtrl.dismiss();
        }
      },
      (error) => {
        this.objectService.errorMessage("ServerError" + error);
        this.authService.log(error);
      },
      () => { subs.unsubscribe() }
    )
  }

  toggle(data, what: string, yesno: boolean) {
    let subs = this.printersService.toggle(data.id, what, yesno).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.objectService.getAllObject('printer');
      },
      (error) => {
        this.objectService.errorMessage("ServerError" + error);
        this.authService.log(error);
      },
      () => { subs.unsubscribe() }
    )
  }
}
