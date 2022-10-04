import { Component, OnInit, Input } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

//own modules
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { CustomerActionRenderer } from 'src/app/pipes/ag-customer-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Customer, Institute } from 'src/app/shared/models/cephalix-data-model'
import { AuthenticationService } from 'src/app/services/auth.service';
import { CephalixService } from 'src/app/services/cephalix.service';

@Component({
  selector: 'cranix-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['id', 'name', 'uuid', 'locality', 'ipVPN', 'regCode', 'validity'];
  sortableColumns: string[] = ['id', 'name', 'uuid', 'locality', 'ipVPN', 'regCode', 'validity'];
  columnDefs = [];
  defaultColDef = {};
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  selected: Customer[] = [];
  title = 'app';
  objectIds: number[] = [];
  myInstitutes: Institute[] = [];

  constructor(
    public authService: AuthenticationService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.objectKeys = Object.getOwnPropertyNames(new Customer());
    this.createColumnDefs();
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    };

  }
  ngOnInit() {
    this.storage.get('CustomersPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = ['select'].concat(myArray).concat(['actions']);
        this.createColumnDefs();
      }
    });
  }

  createColumnDefs() {
    this.columnDefs = [];
    let action = {
      headerName: "",
      minWidth: 130,
      suppressSizeToFit: true,
      cellStyle: { 'padding': '2px', 'line-height': '36px' },
      field: 'actions',
      pinned: 'left',
      cellRendererFramework: CustomerActionRenderer

    };
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
          col['suppressSizeToFit'] = true;
          col['minWidth'] = 250;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          this.columnDefs.push(col);
          this.columnDefs.push(action)
          continue;
        }
        case 'recDate': {
          col['cellRendererFramework'] = DateCellRenderer;
          break;
        }
      }
      this.columnDefs.push(col);
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  onSelectionChanged() {
  }

  onQuickFilterChanged(quickFilter) {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById(quickFilter)).value);
    this.gridApi.doLayout();
  }
  sizeAll() {
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }

  public redirectToDelete = (customer: Customer) => {
    this.objectService.deleteObjectDialog(customer, 'customer', '')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async redirectToAddInstitute(ev: any) {
    this.selected = this.gridApi.getSelectedRows();
    if (!this.selected) {
      this.objectService.selectObject();
      return;
    }
    if (this.selected.length > 1) {
      //TODO Warning
      return;
    }
    let institute = new Institute();
    institute.cephalixCustomerId = this.selected[0].id;
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "institute",
        objectAction: "add",
        object: institute,
        objectKeys: Object.getOwnPropertyNames(institute)
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
  async redirectToEdit(customer: Customer) {
    let action = 'modify';
    if (customer == null) {
      customer = new Customer();
      action = 'add';
    }
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "customer",
        objectAction: action,
        object: customer,
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
        objectPath: "CustomersPage.displayedColumns"
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
  async editInstitutes(customer: Customer) {
    const modal = await this.modalCtrl.create({
      component: EditInstitutes,
      cssClass: 'big-modal',
      componentProps: {
        'customer': customer
      }
    });
    await modal.present();
  }
}

@Component({
  selector: 'edit-institutes-component',
  templateUrl: 'edit-institutes.html'
})
export class EditInstitutes implements OnInit {
  context;
  gridApi;
  columnApi;
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu: true
  }
  columnDefs = [
    { field: 'id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true },
    { field: 'name' },
    { field: 'locality' },
    { field: 'regCode' }
  ];
  disabled: boolean = false;
  myInstituteIds: number[];
  myInstitutes: Institute[];
  rowData: Institute[];
  owned: boolean = false;
  @Input() customer
  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService
  ) {
    this.rowData = this.objectService.allObjects['institute'];
    this.context = { componentParent: this };
  }

  ngOnInit(): void {
    this.myInstitutes = [];
    this.myInstituteIds = [];
    for (let institute of this.objectService.allObjects['institute']) {
      if (institute.cephalixCustomerId && institute.cephalixCustomerId == this.customer.id) {
        this.myInstituteIds.push(institute.id);
        this.myInstitutes.push(institute)
      }
    }
    console.log(this.myInstituteIds)
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.selectMy();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('instituteFilter')).value);
    this.gridApi.doLayout();
  }

  showOwned() {
    this.gridApi.setRowData(this.myInstitutes);
    this.owned = true;
    this.selectMy();
  }
  showAll() {
    this.gridApi.setRowData(this.objectService.allObjects['institute']);
    this.owned = false;
    this.selectMy();
  }
  selectMy() {
    var managedIds = this.myInstituteIds;
    this.gridApi.forEachNode(
      function (node, index) {
        if (managedIds.indexOf(node.data.id) != -1) {
          node.setSelected(true);
        }
      }
    )
  }

  async onSubmit() {
    this.disabled = true;
    let newMyInstituteIds: number[] = [];
    for (let institute of this.gridApi.getSelectedRows()) {
      newMyInstituteIds.push(institute.id)
    }
    for (let i of newMyInstituteIds) {
      if (this.myInstituteIds.indexOf(i) == -1) {
        this.cephalixService.addInstituteToCustomer(i, this.customer.id);
      }
    }
    for (let i of this.myInstituteIds) {
      if (newMyInstituteIds.indexOf(i) == -1) {
        this.cephalixService.deleteInstituteFromCustomer(i, this.customer.id);
      }
    }
    await new Promise(f => setTimeout(f, 3000));
    this.objectService.getAllObject('insitute')
    this.modalCtrl.dismiss()
  }
}
