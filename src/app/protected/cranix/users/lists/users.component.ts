import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
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
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  rowData = [];
  min:  number = -1;
  step: number;
  max:  number;

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.objectKeys = Object.getOwnPropertyNames(new User());
    this.createColumnDefs();
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    }
    this.step = this.authService.settings.lineProPageMD;
    this.max  = this.step + 1;
    console.log("this.authService.settings",this.authService.settings);
  }
  async ngOnInit() {
    this.storage.get('UsersPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
        this.createColumnDefs();
      }
    });
    while ( !this.objectService.allObjects['user'] ) {
      await new Promise(f => setTimeout(f, 1000));
    }
    this.rowData = this.objectService.allObjects['user']
    if( this.max > (this.rowData.length + 1 )) {
      this.max = this.rowData.length + 1
    }
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
          col['headerCheckboxSelection'] = this.authService.settings.headerCheckboxSelection;
          col['headerCheckboxSelectionFilteredOnly'] = true;
          col['checkboxSelection'] = this.authService.settings.checkboxSelection;
          col['minWidth'] = 170;
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          columnDefs.push(col);
          columnDefs.push({
            headerName: "",
            minWidth: 180,
            suppressSizeToFit: true,
            cellStyle: { 'padding': '2px', 'line-height': '36px' },
            field: 'actions',
            pinned: 'left',
            cellRendererFramework: UserActionBTNRenderer
          });
          continue;
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

  selectionChanged(){
    this.objectService.selectedIds = []
    for (let i = 0; i < this.gridApi.getSelectedRows().length; i++) {
      this.objectService.selectedIds.push(this.gridApi.getSelectedRows()[i].id);
    }
    this.objectService.selection = this.gridApi.getSelectedRows()
  }
  checkChange(ev,obj: User){
    if( ev.detail.checked ) {
      this.objectService.selectedIds.push(obj.id)
      this.objectService.selection.push(obj)
    } else {
      this.objectService.selectedIds = this.objectService.selectedIds.filter(id => id != obj.id)
      this.objectService.selection   = this.objectService.selection.filter(obj => obj.id != obj.id)
    }
  }
  onQuickFilterChanged(quickFilter) {
    let filter = (<HTMLInputElement>document.getElementById(quickFilter)).value.toLowerCase();
    if (this.authService.isMD()) {
      this.min = -1;
      this.max = 1 + this.step;
      this.rowData = [];
      for (let obj of this.objectService.allObjects['user']) {
        if (
          obj.uid.toLowerCase().indexOf(filter) != -1 ||
          obj.givenName.toLowerCase().indexOf(filter) != -1 ||
          obj.surName.toLowerCase().indexOf(filter) != -1 ||
          this.languageS.trans(obj.role).toLowerCase().indexOf(filter) != -1
        ) {
          this.rowData.push(obj)
        }
      }
      if( this.rowData.length < this.step ) {
        this.min = -1
        this.max = this.rowData.length +1
      }
    } else {
      this.gridApi.setQuickFilter(filter);
      this.gridApi.doLayout();
    }
  }
  public redirectToDelete = (user: User) => {
    this.objectService.deleteObjectDialog(user, 'user', '')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev
 */
  async openActions(ev: any, object: User) {
    if (object) {
      this.objectService.selectedIds.push(object.id)
      this.objectService.selection.push(object)
    } else {
      if (this.objectService.selection.length == 0) {
        this.objectService.selectObject();
        return;
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "user",
        objectIds: this.objectService.selectedIds,
        selection: this.objectService.selection,
        gridApi: this.gridApi
      },
      translucent: true,
      animated: true,
      showBackdrop: true
    });
    await popover.present();
  }

  async redirectToGroups(user: User) {
    this.objectService.selectedObject = user;
    const modal = await this.modalCtrl.create({
      component: UserGroupsPage,
      cssClass: 'big-modal',
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

  async redirectToEdit(user: User) {
    let action = "modify";
    if (!user) {
      user = new User();
      delete user.msQuotaUsed;
      delete user.fsQuotaUsed;
      delete user.mailAliases;
      delete user.classes;
      action = 'add';
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
        this.authService.log("Object was created or modified", dataReturned.data)
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
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
