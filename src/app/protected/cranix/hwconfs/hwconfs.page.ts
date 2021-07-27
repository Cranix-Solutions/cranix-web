import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateCellRenderer } from 'src/app/pipes/ag-date-renderer';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { Hwconf } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-hwconfs',
  templateUrl: './hwconfs.page.html',
  styleUrls: ['./hwconfs.page.scss'],
})
export class HwconfsPage implements OnInit {
  objectKeys: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'deviceType', 'actions'];
  sortableColumns: string[] = ['name', 'description', 'deviceType'];
  defaultColDef = {};
  columnDefs = [];
  gridApi;
  columnApi;
  rowSelection;
  context;
  selected: Hwconf[] = [];
  title = 'app';
  constructor(
    public authService: AuthenticationService,
    public languageS: LanguageService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private route: Router,
    private storage: Storage
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.objectKeys = Object.getOwnPropertyNames(new Hwconf());
    this.createColumnDefs();
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      hide: false,
      suppressMenu: true
    }
  }
  ngOnInit() {
    this.storage.get('HwconfsPage.displayedColumns').then((val) => {
      let myArray = JSON.parse(val);
      if (myArray) {
        this.displayedColumns = myArray.concat(['actions']);
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
      cellRendererFramework: ActionBTNRenderer
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
          col['width'] = 220;
          col['suppressSizeToFit'] = true;
          col['pinned'] = 'left';
          col['flex'] = '1';
          col['colId'] = '1';
          this.columnDefs.push(col);
          this.columnDefs.push(action);
          continue;
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

  public redirectToDelete = (hwconf: Hwconf) => {
    this.objectService.deleteObjectDialog(hwconf, 'hwconf','')
  }
  /**
 * Open the actions menu with the selected object ids.
 * @param ev 
 */
  async openActions(ev: any, objId: number) {
    this.selected = this.gridApi.getSelectedRows();
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
        objectType: "hwconf",
        objectIds: objectIds,
        selection: this.selected,
        gridApi:   this.gridApi
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  async redirectToEdit(ev: Event, hwconf: Hwconf) {
    if (hwconf) {
      this.objectService.selectedObject = hwconf;
      this.route.navigate(['/pages/cranix/hwconfs/' + hwconf.id]);
    } else {
      const modal = await this.modalCtrl.create({
        component: ObjectsEditComponent,
        componentProps: {
          objectType: "hwconf",
          objectAction: "add",
          object: new Hwconf(),
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
        objectPath: "HwconfsPage.displayedColumns"
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
      this.authService.log("most lett vegrehajtva.")
    })
  }
}
