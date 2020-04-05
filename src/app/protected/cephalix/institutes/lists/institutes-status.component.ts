import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__, AfterContentInit } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Institute, InstituteStatus } from 'src/app/shared/models/cephalix-data-model'
import { UpdateRenderer } from '../../../../pipes/ag-update-renderer';
import { AuthenticationService } from '../../../../services/auth.service';

@Component({
  selector: 'cranix-institutes-status',
  templateUrl: './institutes-status.component.html',
  styleUrls: ['./institutes-status.component.scss'],
})
export class InstitutesStatusComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['cephalixInstituteId', 'created', 'uptime', 'version', 'lastUpdate', 'rootUsage', 'srvUsage', 'homeUsage', 'runningKernel', 'installedKernel', 'availableUpdates'];
  sortableColumns: string[] = ['cephalixInstituteId', 'created', 'uptime', 'version', 'lastUpdate', 'rootUsage', 'srvUsage', 'homeUsage', 'runningKernel', 'installedKernel', 'availableUpdates'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Institute[];
  title = 'app';
  rowData = [];
  objectIds: number[] = [];

  constructor(
    private authService: AuthenticationService,
    private cephalixService: CephalixService,
    private objectService: GenericObjectService,
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
    this.storage.get('InstitutesStatusComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = (myArray).concat(['actions']);
        this.createColumnDefs();
      }
    });
    let subs = this.cephalixService.getStatusOfInstitutes().subscribe(
      (val) => { this.rowData = val },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
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
          col['headerCheckboxSelection'] = true;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = true;
          break;
        }
        case 'lastUpdate': {
          col['cellRendererFramework'] = DateTimeCellRenderer;
          break;
        }
        case 'runningKernel': {
          col['valueGetter'] = function (params) {
            let index = params.data.runningKernel.indexOf("-default");
            let run = params.data.runningKernel.substring(0, index);
            let inst = params.data.installedKernel.substring(0, index);
            console.log(run)
            console.log(inst)
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
        case 'cephalixInstituteId': {
          col['valueGetter'] = function (params) {
            return params.context['componentParent'].objectService.idToName('institute', params.data.cephalixInstituteId);
          }
          break;
        }
        case 'availableUpdates': {
          col['cellRendererFramework'] = UpdateRenderer;
          break;
        }
        case 'created': {
          col['cellRendererFramework'] = DateTimeCellRenderer;
          break;
        }
      }
      columnDefs.push(col);
    }
    columnDefs.push({
      headerName: "",
      field: 'actions',
      cellRendererFramework: ActionBTNRenderer
    });
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.75) + "px";
    this.gridApi.sizeColumnsToFit();
  }
  onSelectionChanged() {
    this.selected = this.gridApi.getSelectedRows();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("quickFilter")).value);
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
      (val) => { console.log(val) },
      (error) => { console.log(error) },
      () => { sub.unsubscribe(); }
    );
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any) {
    if (this.selected) {
      for (let i = 0; i < this.selected.length; i++) {
        this.objectIds.push(this.selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "institute",
        objectIds: this.objectIds,
        selection: this.selected
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
          console.log("Object was created or modified", dataReturned.data)
        }
      });
      (await modal).present();
    }
  }

  /**
  * Function to select the columns to show
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
        this.displayedColumns = (dataReturned.data).concat(['actions']);
        this.createColumnDefs();
      }
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }
}
