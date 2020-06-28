import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__, AfterContentInit } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { InstituteUUIDCellRenderer } from 'src/app/pipes/ag-uuid-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Institute } from 'src/app/shared/models/cephalix-data-model'

@Component({
  selector: 'cranix-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.scss'],
})
export class InstitutesComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'uuid', 'locality', 'ipVPN', 'regCode', 'validity'];
  sortableColumns: string[] = ['uuid', 'name', 'locality', 'ipVPN', 'regCode', 'validity'];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  title = 'app';
  rowData = [];

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
    this.objectKeys = Object.getOwnPropertyNames(cephalixService.templateInstitute);
    this.createColumnDefs();
    this.defaultColDef = {
        resizable: true,
        sortable: true,
        hide: false,
        suppressMenu : true
      };
  }

  ngOnInit() {
    this.storage.get('InstitutesComponent.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = (myArray).concat(['actions']);
        this.createColumnDefs();
      }
    });
    this.objectService.getObjects('institute').subscribe(obj => this.rowData = obj);
  }

  createColumnDefs() {
    let columnDefs = [];
    for (let key of this.objectKeys) {
      let col = {};
      col['field'] = key;
      col['headerName'] = this.languageS.trans(key);
      col['hide'] = (this.displayedColumns.indexOf(key) == -1);
      col['sortable'] = (this.sortableColumns.indexOf(key) != -1);
      col['minWidth'] = 110;
      switch (key) {
        case 'name': {
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['width'] = 220;
          col['flex'] = '1';

          col['cellStyle'] = { 'padding-left': '2px', 'padding-right': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['colId'] = '1';
       
       //   col['cellRendererFramework'] = ActionBTNRenderer;
          break;
        }
        case 'uuid': {
          col['cellRendererFramework'] = InstituteUUIDCellRenderer;
          col['cellStyle'] = {'padding-left' : '2px'}
          break;
        }
        case 'validity': {
          col['cellRendererFramework'] = DateCellRenderer;
          break;
        }
        case 'recDate': {
          col['cellRendererFramework'] = DateCellRenderer;
          break;
        }
      }
      columnDefs.push(col);
    }
    let check = {
      headerName: "",
      width: 85,
   //   headerCheckboxSelection: true,
   //   headerCheckboxSelectionFilteredOnly: true,
   //   checkboxSelection : true,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: ActionBTNRenderer
    };

    columnDefs.splice(1, 0, check)
    this.authService.log('columnsDef', columnDefs);
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
   // this.sizeAll();
  }
  onSelectionChanged() {
    this.cephalixService.selectedInstitutes = this.gridApi.getSelectedRows();
    this.cephalixService.selectedList = [];
    for (let o of this.cephalixService.selectedInstitutes) {
      this.cephalixService.selectedList.push(o.name)
    }
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();
  }

  onGridSizeChange(params) {
    var allColumns = params.columnApi.getAllColumns();
    params.api.sizeColumnsToFit();
    params.columnApi.autoSizeColumns();
    //this.sizeAll();
  }

  sizeAll(skip) {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    //this.gridApi.sizeColumnsToFit();
    this.columnApi.autoSizeColumns(allColumnIds, skip);
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  public redirectToDelete = (institute: Institute) => {
    this.objectService.deleteObjectDialog(institute, 'institute')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any, objId: number) {
    if (this.cephalixService.selectedInstitutes.length ==0  && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < this.cephalixService.selectedInstitutes.length; i++) {
        objectIds.push(this.cephalixService.selectedInstitutes[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "institute",
        objectIds: objectIds,
        selection: this.cephalixService.selectedInstitutes
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
          object: this.cephalixService.templateInstitute,
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
        objectPath: "InstitutesComponent.displayedColumns"
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
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
