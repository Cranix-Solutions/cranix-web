import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

//own modules
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { FileSystemUsageRenderer } from 'src/app/pipes/ag-filesystem-usage-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Institute } from 'src/app/shared/models/cephalix-data-model'
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-institute-status',
  templateUrl: './institute-status.component.html',
  styleUrls: ['./institute-status.component.scss'],
})
export class InstituteStatusComponent implements OnInit {
  object: Institute = null;
  objectKeys: string[] = [];
  displayedColumns: string[] = ['created', 'uptime', 'version', 'rootUsage', 'srvUsage', 'homeUsage', 'availableUpdates', 'errorMessages'];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Institute[];
  rowData = [];
  objectIds: number[] = [];

  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    private storage: Storage
  ) {
    this.object = <Institute>this.objectService.selectedObject;
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.createColumnDefs();
    this.defaultColDef = {
      flex: 1,
      cellStyle: { 'justify-content': "center" },
      minWidth: 100,
      maxWidth: 150,
      suppressHeaderMenuButton: true,
      sortable: true,
      resizable: false
    };
  }

  ngOnInit() {
    this.storage.get('InstitutesStatusComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.createColumnDefs();
      }
    });
    let subs = this.cephalixService.getStatusOfInstitute(this.object.id).subscribe(
      (val) => { this.rowData = val },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() }
    )
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);

  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  createColumnDefs() {
    this.columnDefs = [];
    for (let key of this.displayedColumns) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      switch (key) {
        case 'lastUpdate': {
          col['cellRenderer'] = DateTimeCellRenderer;
          break;
        }
        case 'rootUsage': {
          col['headerClass'] = "rotate-header-class"
          col['minWidth'] = 70
          col['cellRenderer'] = FileSystemUsageRenderer;
          break;
        }
        case 'homeUsage': {
          col['headerClass'] = "rotate-header-class"
          col['minWidth'] = 70
          col['cellRenderer'] = FileSystemUsageRenderer;
          break;
        }
        case 'srvUsage': {
          col['headerClass'] = "rotate-header-class"
          col['minWidth'] = 70
          col['cellRenderer'] = FileSystemUsageRenderer;
          break;
        }
        case 'varUsage': {
          col['headerClass'] = "rotate-header-class"
          col['width'] = 70
          col['cellRenderer'] = FileSystemUsageRenderer;
          break;
        }
        case 'runningKernel': {
          col['headerClass'] = "rotate-header-class"
          col['minWidth'] = 100;
          col['valueGetter'] = function (params) {
            let index = params.data.runningKernel.indexOf("-default");
            let run = params.data.runningKernel.substring(0, index);
            let inst = params.data.installedKernel.substring(0, index);
            if (run == inst) {
              return "OK"
            } else {
              return "need reboot"
            }
          }
          break;
        }
        case 'installedKernel': {
          col['hide'] = true;
          break;
        }
        case 'availableUpdates': {
          col['headerClass'] = "rotate-header-class"
          col['minWidth'] = 70;
          col['valueGetter'] = function (params) {
            return params.data.availableUpdates.split(" ").length
          }
          break;
        }
        case 'created': {
          col['cellRenderer'] = DateTimeCellRenderer;
          break;
        }
        case 'errorMessages': {
          col['cellStyle'] = params => params.value ? { 'background-color': 'red' } : { 'background-color': '#2dd36f' }
        }
      }
      this.columnDefs.push(col);
    }
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
        objectPath: "InstitutesStatusComponent.displayedColumns"
      },
      animated: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.createColumnDefs();
      }
    });
    (await modal).present().then((val) => {
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
