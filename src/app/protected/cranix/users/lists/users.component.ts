import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { UserActionBTNRenderer } from 'src/app/pipes/ag-user-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { User } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { UserGroupsPage } from '../details/groups/user-groups.page';

@Component({
  selector: 'cranix-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['uid', 'uuid', 'givenName', 'surName', 'role', 'classes', 'actions'];
  sortableColumns: string[] = ['uid', 'uuid', 'givenName', 'surName', 'role', 'classes'];
  gridOptions: GridOptions;
  columnDefs = [];
  gridApi: GridApi;
  rowSelection: 'multiple';
  columnApi: ColumnApi;
  context;
  selected: User[] = [];
  title = 'app';
  rowData = [];

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
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
          col['width'] = 170;
          col['cellStyle'] = { 'padding-left': '2px' };
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          break;
        }
        case 'birthDay': {
          col['cellRendererFramework'] = DateCellRenderer;
          break;
        }
      }
      columnDefs.push(col);
    }
    let action = {
      headerName: "",
      width: 150,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: UserActionBTNRenderer
    };
    columnDefs.splice(1, 0, action);
    this.columnDefs = columnDefs;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  //  (<HTMLInputElement>document.getElementById("agGridTable")).style.height = Math.trunc(window.innerHeight * 0.7) + "px";
    this.gridApi.sizeColumnsToFit();
    this.sizeAll();
  }
  onSelectionChanged() {
    this.selected = this.gridApi.getSelectedRows();
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
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
  async openActions(ev: any, objId: number) {
    if (this.selected.length == 0 && !objId) {
      this.objectService.selectObject();
      return;
    }
    let objectIds = [];
    if (objId) {
      objectIds.push(objId)
    } else {
      for (let i = 0; i < this.selected.length; i++) {
        objectIds.push(this.selected[i].id);
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "user",
        objectIds: objectIds,
        selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  async redirectToGroups(ev: Event, user: User) {
    this.objectService.selectedObject = user;
    const modal = await this.modalCtrl.create({
      component: UserGroupsPage,
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

  async redirectToEdit(ev: Event, user: User) {
    let action = "modify";
    if (!user) {
      user = new User();
      delete user.msQuotaUsed;
      delete user.fsQuotaUsed;
      delete user.mailAliases;
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      cssClass: 'medium-modal',
      componentProps: {
        objectType: "user",
        objectAction: action,
        object: user
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
        objectPath: "UsersPage.displayedColumns"
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
