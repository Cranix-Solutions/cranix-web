import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { FileSystemUsageRenderer } from 'src/app/pipes/ag-filesystem-usage-renderer';
import { InstituteStatusRenderer } from 'src/app/pipes/ag-institute-status-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { InstituteStatus } from 'src/app/shared/models/cephalix-data-model'
import { UpdateRenderer } from 'src/app/pipes/ag-update-renderer';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
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
  now: number = 0;
  selectedStatus: InstituteStatus = null;

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
      resizable: true,
      wrapText: true,
      autoHeight: true,
      sortable: true,
      width: 70,
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          '  </div>' +
          '</div>',
      }
    };
  }

  ngOnInit() {
    this.now = new Date().getTime();
    this.storage.get('InstitutesStatusComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray;
        this.createColumnDefs();
      }
    });
  }
  ionViewWillEnter() {
    this.authService.log('WillEnter EVENT')
    let subs = this.cephalixService.getStatusOfInstitutes().subscribe(
      (val) => {
        val.sort((status1: InstituteStatus, status2: InstituteStatus) => {
          let i1 = this.objectService.getObjectById('institute', status1.cephalixInstituteId)
          let i2 = this.objectService.getObjectById('institute', status2.cephalixInstituteId)
          return i1.name.toUpperCase() < i2.name.toUpperCase() ? -1 : 1
        });
        this.rowData = val;
      },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() }
    )
  }
  createColumnDefs() {
    this.columnDefs = [
      {
        field: 'count',
        headerName: '#',
        maxWidth: 30,
        valueGetter: function (params) {
          return params.node.id
        }
      }
    ];
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
          col['cellStyle'] = { 'justify-content': "left", 'wrap-text': 0 };
          col['cellRendererFramework'] = InstituteStatusRenderer;
          this.columnDefs.push(col);
          this.columnDefs.push({
            headerName: this.languageS.trans('ipVPN'),
            editable: true,
            width: 100,
            valueGetter: function (params) {
              let institute = params.context['componentParent'].objectService.getObjectById('institute', params.data.cephalixInstituteId);
              return institute.ipVPN;
            }
          })
          continue;
        }
        case 'lastUpdate': {
          col['cellRendererFramework'] = DateCellRenderer;
          break;
        }
        case 'rootUsage': {
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'homeUsage': {
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'srvUsage': {
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'varUsage': {
          col['cellRendererFramework'] = FileSystemUsageRenderer;
          break;
        }
        case 'runningKernel': {
          col['valueGetter'] = function (params) {
            let index = params.data.runningKernel.indexOf("-default");
            let run = params.data.runningKernel.substring(0, index);
            let inst = params.data.installedKernel.substring(0, index);
            if (run == inst) {
              return "OK"
            } else {
              return "reboot"
            }
          }
          break;
        }
        case 'installedKernel': {
          col['hide'] = true;
          break;
        }
        case 'availableUpdates': {
          col['cellRendererFramework'] = UpdateRenderer;
          break;
        }
        case 'created': {
          col['width'] = 160
          col['maxWidth'] = 160
          col['cellRendererFramework'] = DateTimeCellRenderer;
          col['cellStyle'] = params => (this.now - params.value) > 36000000 ? { 'background-color': 'red' } : { 'background-color': '#2dd36f' }
          break;
        }
        case 'errorMessages': {
          col['cellStyle'] = params => params.value ? { 'background-color': 'red' } : { 'background-color': '#2dd36f' }
          break
        }
        default: {
          col['width'] = 150
        }
      }
      this.columnDefs.push(col);
    }
  }

  errorStatus(status: InstituteStatus) {
    if (status.errorMessages) {
      return "danger";
    }
    return "success"
  }

  fileSystemError(fs: string) {
    if (!fs) {
      return false
    }
    let result = fs.split(" ");
    if (result) {
      if (Number(result[1].replace('%', '')) > 80) {
        return true
      }
      else if (Number(result[2].replace('%', '')) > 80) {
        return true
      }
    }
    return false
  }
  fsStatus(status: InstituteStatus) {
    if (this.fileSystemError(status.rootUsage) ||
      this.fileSystemError(status.srvUsage) ||
      this.fileSystemError(status.homeUsage)) {
      return "danger"
    }
    return "success"
  }

  connectStatus(status: InstituteStatus) {
    if (this.now - status.created > 36000000) {
      return "danger"
    }
    return "success"
  }
  showStatus(status: InstituteStatus) {
    this.selectedStatus = status;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  headerHeightSetter() {
    var padding = 20;
    var height = headerHeightGetter() + padding;
    this.gridApi.setHeaderHeight(height);
    this.gridApi.resetRowHeights();
  }
  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();
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
        selection: this.gridApi.getSelectedRows(),
        gridApi: this.gridApi
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  redirectToEdit(status: InstituteStatus) {
    this.objectService.selectedObject = this.objectService.getObjectById("institute", status.cephalixInstituteId);
    this.route.navigate([`/pages/cephalix/institutes/${status.cephalixInstituteId}`]);
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

  sortStatus(status1: InstituteStatus, status2: InstituteStatus) {
    console.log(status1, status2)
    if (status1 && status2) {
      let i1 = this.objectService.getObjectById('institute', status1.cephalixInstituteId)
      let i2 = this.objectService.getObjectById('institute', status2.cephalixInstituteId)
      return i1.name < i2.name ? 1 : -1
    }
    return 0
  }
}

function headerHeightGetter() {
  var columnHeaderTexts = document.querySelectorAll('.ag-header-cell-text');

  var columnHeaderTextsArray = [];

  columnHeaderTexts.forEach(node => columnHeaderTextsArray.push(node));

  var clientHeights = columnHeaderTextsArray.map(
    headerText => headerText.clientHeight
  );
  var tallestHeaderTextHeight = Math.max(...clientHeights);
  return tallestHeaderTextHeight;
}
