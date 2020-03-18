import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from '../../../shared/actions/actions.component';
import { DateCellRenderer } from '../../../pipes/ag-date-renderer';
import { ActionBTNRenderer } from '../../../pipes/ag-action-renderer';
import { ObjectsEditComponent } from '../../../shared/objects-edit/objects-edit.component';
import { GenericObjectService } from '../../../services/generic-object.service';
import { LanguageService } from '../../../services/language.service';
import { SelectColumnsComponent } from '../../../shared/select-columns/select-columns.component';
import { User } from '../../../shared/models/data-model'

@Component({
  selector: 'cranix-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['uid', 'uuid', 'givenName', 'surName', 'role', 'classes', 'actions'];
  sortableColumns: string[] = [ 'uid', 'uuid', 'givenName', 'surName', 'role', 'classes' ];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  selected: User[];
  title = 'app';
  rowData = [];
  objectIds: number[] = [];

  constructor(
    private objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    private route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.objectKeys = Object.getOwnPropertyNames(new User());
    this.createColumnDefs();
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true,
        sortable: true,
        hide: false
      },
      columnDefs: this.columnDefs,
      context: this.context,
      rowSelection: 'multiple',
      rowHeight: 35
    }
  }
  ngOnInit() {
    this.storage.get('UsersPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    this.objectService.getObjects('user').subscribe(obj => this.rowData = obj);
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
        case 'uid': {
          col['headerCheckboxSelection'] = true;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = true;
          break;
        }
        case 'birthDay': {
          col['cellRendererFramework'] = DateCellRenderer;
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
    console.log("window");
    console.log(window);
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

  public redirectToDelete = (user: User) => {
    this.objectService.deleteObjectDialog(user, 'user')
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
        objectType: "user",
        objectIds: this.objectIds,
        selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  async redirectToEdit(ev: Event, user: User) {
    if (user) {
      this.objectService.selectedObject = user;
       this.route.navigate(['/pages/cranix/users/' + user.id]);
    } else {
      user = new User();
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "user",
          objectAction: "add",
          object: user,
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
        objectPath: "UsersPage.displayedColumns"
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.displayedColumns = ['select'].concat(dataReturned.data).concat(['actions']);
      }
    });
    (await modal).present().then((val) => {
      console.log("most lett vegrehajtva.")
    })
  }
}
