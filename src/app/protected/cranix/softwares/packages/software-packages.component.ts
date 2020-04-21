import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { DownloadSoftwaresComponent } from 'src/app/shared/actions/download-softwares/download-softwares.component';
import { EditBTNRenderer } from 'src/app/pipes/ag-edit-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SoftwareService } from 'src/app/services/softwares.service';
import { Software } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-software-packages',
  templateUrl: './software-packages.component.html',
  styleUrls: ['./software-packages.component.scss'],
})
export class SoftwarePackagesComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'description','version', 'weight'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Software[];
  title = 'app';
  rowData: Software[] = [];
  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public softwareService: SoftwareService,
    private languageS: LanguageService
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Software());
    this.createColumnDefs();
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowHeight: 35
    }
  }

  ngOnInit() {
    this.createColumnDefs();
    this.readInstallableSoftware();
  }

  async readInstallableSoftware() {
    let subM = this.softwareService.getInstallableSoftwares().subscribe(
      (val) => { 
        this.rowData = val;
        console.log(val);
        this.gridApi.redrawRows();
       },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
      await this.sleep(3000);
  }
  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }
  createColumnDefs() {
    let columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = true;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = true;
          col['width'] = 220;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          break;
        }
        case 'version': {
          col['valueGetter'] =  function (params) {
            return params.data.softwareVersions[0].version;
          }
          break;
        }
      }
      columnDefs.push(col);
    }
    let action = {
      headerName: "",
      width: 100,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: EditBTNRenderer
    };
    columnDefs.splice(1, 0, action)
    this.columnDefs = columnDefs;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
  }
  onSelectionChanged() {
    this.selected = this.gridApi.getSelectedRows();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("quickFilter")).value);
    this.gridApi.doLayout();
  }
  onResize($event) {
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
    this.sizeAll();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }

  public redirectToDelete = (software: Software) => {
    this.objectService.deleteObjectDialog(software, 'software')
  }

  /**
* Function to select the columns to show
* @param ev
*/
  async downloadSoftwares(ev: any) {
    const modal = await this.modalCtrl.create({
      component: DownloadSoftwaresComponent,
      componentProps: {
        columns: this.objectKeys,
        selected: this.displayedColumns
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
      console.log("most lett vegrehajtva.")
    })
  }
  async redirectToEdit(ev: Event, software: Software) {
    let action = 'edit';
    if (!software) {
      software = new Software();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "software",
        objectAction: action,
        object: software
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

}
