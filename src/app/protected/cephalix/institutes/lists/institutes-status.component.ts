import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { FileSystemUsageRenderer } from 'src/app/pipes/ag-filesystem-usage-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Institute, InstituteStatus } from 'src/app/shared/models/cephalix-data-model'
import { UpdateRenderer } from 'src/app/pipes/ag-update-renderer';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-institutes-status',
  templateUrl: './institutes-status.component.html',
  styleUrls: ['./institutes-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstitutesStatusComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['cephalixInstituteId', 'created', 'uptime', 'version', 'lastUpdate', 'availableUpdates', 'errorMessages', 'rootUsage', 'srvUsage', 'homeUsage', 'runningKernel', 'installedKernel'];
  sortableColumns: string[] = ['cephalixInstituteId', 'created', 'uptime', 'version', 'lastUpdate', 'availableUpdates', 'errorMessages', 'rootUsage', 'srvUsage', 'homeUsage', 'runningKernel', 'installedKernel'];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  title = 'app';
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

    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new InstituteStatus());
    this.createColumnDefs();
    this.defaultColDef = {
      flex: 1,
      cellStyle: { 'justify-content': "center" },
      minWidth: 100,
      maxWidth: 200,
      suppressMenu: true,
      sortable: true,
      resizable: false
    };
  }

  ngOnInit() {
    this.storage.get('InstitutesStatusComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray;
        this.createColumnDefs();
      }
    });
    let subs = this.cephalixService.getStatusOfInstitutes().subscribe(
      (val) => {
        this.rowData = val;
      },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() }
    )
  }
  ionViewWillEnter() {
    this.authService.log('WillEnter EVENT')
    let subs = this.cephalixService.getStatusOfInstitutes().subscribe(
      (val) => {
        this.authService.log('new data in event:', val);
        this.rowData = val
      },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() })
  }
  createColumnDefs() {
    this.columnDefs = [];
    let now: number = new Date().getTime();
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['sortable'] = (this.sortableColumns.indexOf(key) != -1);
      switch (key) {
        case 'cephalixInstituteId': {
          //col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          //col['headerCheckboxSelectionFilteredOnly'] = true;
          //col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['minWidth'] = 220;
          col['maxWidth'] = 220;
          col['cellStyle'] = { 'justify-content': "left" };
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('institute', params.data.cephalixInstituteId);
          }
          this.columnDefs.push(col);
          this.columnDefs.push({
            headerName: this.languageS.trans('ipVPN'),
            editable: true,
            valueGetter: function (params) {
              let institute = params.context['componentParent'].objectService.getObjectById('institute', params.data.cephalixInstituteId);
              return institute.ipVPN;
            }
          })
          continue;
        }
        case 'lastUpdate': {
          col['cellRendererFramework'] = DateTimeCellRenderer;
          break;
        }
        case 'rootUsage': {
          col['headerClass'] = "rotate-header-class"
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'homeUsage': {
          col['headerClass'] = "rotate-header-class"
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'srvUsage': {
          col['headerClass'] = "rotate-header-class"
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'varUsage': {
          col['headerClass'] = "rotate-header-class"
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'runningKernel': {
          col['headerClass'] = "rotate-header-class"
          col['valueGetter'] = function (params) {
            let index = params.data.runningKernel.indexOf("-default");
            let run   = params.data.runningKernel.substring(0, index);
            let inst  = params.data.installedKernel.substring(0, index);
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
          col['widtminWidthh'] = 100;
          col['cellRendererFramework'] = UpdateRenderer;
          break;
        }
        case 'created': {
          col['cellRendererFramework'] = DateTimeCellRenderer;
          col['cellStyle'] = params => ( now - params.value ) > 36000000 ? { 'background-color': 'red' } : { 'background-color': '#2dd36f' }
          break;
        }
        case 'errorMessages': {
          col['headerClass'] = "rotate-header-class"
          col['cellStyle'] = params => params.value ? { 'background-color': 'red' } : { 'background-color': '#2dd36f' }
        }
      }
     this.columnDefs.push(col);
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.75) + "px";
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();

  }
  onResize($event) {
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.75) + "px";
    this.sizeAll();
    this.gridApi.sizeColumnsToFit();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }
  //TODO RESPONSE
  public redirectToUpdate = (cephalixInstituteId: number) => {
    let sub = this.cephalixService.updateById(cephalixInstituteId).subscribe(
      (val) => { this.authService.log(val) },
      (error) => { this.authService.log(error) },
      () => { sub.unsubscribe(); }
    );
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any) {
    if (this.gridApi.getSelectedRows().length > 0) {
      for (let i = 0; i < this.gridApi.getSelectedRows().length; i++) {
        this.objectIds.push(this.gridApi.getSelectedRows()[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "sync-object",
        objectIds: this.objectIds,
        selection: this.gridApi.getSelectedRows()
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, institute: Institute) {
    if (institute) {
      this.objectService.selectedObject = institute;
      this.route.navigate(['/pages/cephalix/institutes/' + institute.id]);
    } else {
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "institute",
          objectAction: 'add',
          object: new Institute(),
          objectKeys: this.objectKeys
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
      swipeToClose: true,
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
