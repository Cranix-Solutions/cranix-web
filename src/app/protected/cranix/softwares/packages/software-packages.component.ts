import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
//Own stuff
import { AuthenticationService } from 'src/app/services/auth.service';
import { DownloadSoftwaresComponent } from 'src/app/shared/actions/download-softwares/download-softwares.component';
import { SoftwareEditBTNRenderer } from 'src/app/pipes/ag-software-edit-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SoftwareService } from 'src/app/services/softwares.service';
import { Software } from 'src/app/shared/models/data-model';
import { SoftwareLicensesComponent } from 'src/app/shared/actions/software-licenses/software-licenses.component';

@Component({
  selector: 'cranix-software-packages',
  templateUrl: './software-packages.component.html',
  styleUrls: ['./software-packages.component.scss'],
})
export class SoftwarePackagesComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'version', 'weight', 'sourceAvailable'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
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
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  async readInstallableSoftware() {
    this.softwareService.readInstallableSoftwares();
    await this.sleep(3000);
  }
  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  createColumnDefs() {
    this.columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['minWidth'] = 220;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          this.columnDefs.push(col);
          this.columnDefs.push({
            headerName: "",
            minWidth: 150,
            suppressSizeToFit: true,
            cellStyle: { 'padding': '2px', 'line-height': '36px' },
            field: 'actions',
            pinned: 'left',
            cellRendererFramework: SoftwareEditBTNRenderer
          });
          continue;
        }
        case 'version': {
          col['valueGetter'] = function (params) {
            return params.data.softwareVersions[0].version;
          }
          break;
        }
      }
      this.columnDefs.push(col);
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
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
   * Function to select the software packages to download
   * @param ev
   */
  async downloadSoftwares(ev: any) {
    const modal = await this.modalCtrl.create({
      component: DownloadSoftwaresComponent,
      cssClass: "medium-modal",
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
      this.authService.log("downloadSoftwares executed.")
    })
  }

  /**
   * Modify or add a software package
   * @param ev
   * @param software
   */
  async redirectToEdit(ev: Event, software: Software) {
    let action = 'modify';
    if (!software) {
      action = 'add';
      software = new Software();
    }
    delete software.softwareFullNames;
    delete software.softwareVersions;
    delete software.sourceAvailable;
    this.authService.log(software);
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "software",
        objectAction: action,
        object: software
      },
      cssClass: 'medium-modal',
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

  async redirectToLicenses(software) {
    const modal = await this.modalCtrl.create({
      component: SoftwareLicensesComponent,
      componentProps: {
        software: software
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
