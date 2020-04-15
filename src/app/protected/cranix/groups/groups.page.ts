import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Group } from 'src/app/shared/models/data-model'

@Component({
  selector: 'cranix-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'roomControl', 'hwconfId','actions'];
  sortableColumns: string[] = ['name', 'description', 'roomControl', 'hwconfId'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  rowSelection;
  context;
  selected: Group[];
  title = 'app';
  rowData = [];
  objectIds: number[] = [];

  constructor(
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Group());
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
    this.storage.get('GroupsPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
	this.displayedColumns = myArray.concat(['actions']);
	this.createColumnDefs();
      }
    });
    this.objectService.getObjects('group').subscribe(obj => this.rowData = obj);
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

  public redirectToDelete = (group: Group) => {
    this.objectService.deleteObjectDialog(group, 'group')
  }
  /**
  * Open the actions menu with the selected object ids.
  * @param ev
  */
  async openActions(ev: any) {
    if( !this.selected) {
      this.objectService.selectObject();
      return;
    }
    this.objectKeys = [];
    for (let i = 0; i < this.selected.length; i++) {
      this.objectIds.push(this.selected[i].id);
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "group",
        objectIds: this.objectIds,
        selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, group: Group) {
    if (group) {
      this.objectService.selectedObject = group;
      this.route.navigate(['/pages/cranix/groups/' + group.id]);
    } else {
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "group",
          objectAction: "add",
          object: new Group(),
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
        objectPath: "GroupsPage.displayedColumns"
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
}
