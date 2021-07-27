import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model'
import { InstituteActionCellRenderer } from 'src/app/pipes/ag-institute-action-renderer';
import { LanguageService } from 'src/app/services/language.service';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';

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
        suppressMenu : true,
        minWidth: 110
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
          col['minWidth'] = 230;
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          columnDefs.push(col);
          columnDefs.push({
            headerName: "",
            minWidth: 90,
            maxWidth: 140,
            cellStyle: { 'padding': '1px' },
            field: 'actions',
            pinned: 'left',
            cellRendererFramework: InstituteActionCellRenderer
          })
          continue;
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
    this.columnDefs = columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
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
    this.objectService.deleteObjectDialog(institute, 'institute','')
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
        selection: this.cephalixService.selectedInstitutes,
        gridApi:   this.gridApi
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
